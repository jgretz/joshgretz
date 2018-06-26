### A Brief History
I've been building websites since the "pre-IE" days of the internet. Even with [slow connections over modems](https://www.youtube.com/watch?v=ckc6XSSh52w), images have always been a key part of those pages, and as the speeds have increased so have the number of images as well as their respective sizes. Despite this fact, the image tag and its handling by the browsers hasn't significantly changed. Although the images can load asynchronously in most browsers, rendering can still be blocked or jumpy while the image loads - leading to a poor experience for the user.

There has been a decent amount of work in this area recently - libraries such as [react-image](https://github.com/mbrevda/react-image) and [react-ideal-image](https://github.com/stereobooster/react-ideal-image) attempt to solve this problem through the combination of spinners, lazy loading, and placeholders. These approaches can solve the end user experience problem, but I wanted to find an approach that actually addresses the performance rather than masking it. The pursuit of this goal led me to service workers.

### Service Workers
Service workers are a relatively newish addition to the web developer's toolkit. In short, they allow code to execute in a background thread managed by the browser - which is perfect for calculation intensive or asynchronous work. This frees the main thread up to render the page and respond to the user - which is fit the behavior I was looking for. If you're interested, you can read more about service workers here: [Web Fundamental - Service Workers](https://developers.google.com/web/fundamentals/primers/service-workers/#browser_support).

#### Initializing the Worker
Service workers typically point at a URL that contains the JavaScript function that it executes. Given our context of a React app though, having a side JavaScript file isn't really something that occurs naturally. Fortunately, there is a easy workaround - we can use built in functions in JavaScript to emulate a file from a local function pointer. It looks something like this:

```
const workerLogic = () => {
  self.onmessage = e => {
    const sender = self;

    // do something
    fetch('url')
      .then(() => {
        sender.postMessage({success: true});
      });
  };
};

let code = workerLogic.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

const blob = new Blob([code], {type: 'application/javascript'});
const workerScript = URL.createObjectURL(blob);
```

Now we have a script that we can pass to the JavaScript Worker object like this:

```
const worker = new Worker(workerScript);
worker.onmessage = m => {
  // do something
};
worker.postMessage(src);
```

#### Communicating There and Back
Since the service worker is working on a different thread, it can't share resources with the rest of the code in the file. As you can see in the code above, we communicate between the two processes by passing messages. These messages can be a string or a simple javascript object.

For the purposes of image loading there is another critical memory consideration to note. While the code does indeed execute on multiple threads, all share the browser cache. Thus an image loaded in the background on a service worker will be found in the browser's cache by the main thread when that same url is set as the src of the image. We will be taking advantage of this fact in the next section.

### Encapsulating in a React Component
Now that we have the structure of how to create a service worker, we need to encapsulate this as a react component. My goal is to use the component like so:

```
<WorkerImage src="https://url.of.image" />
```

To provide this interface, we do something like the following code block. And yes, this is a fully working component 😃😃😃😃😃

```
import React, {Component} from 'react';

// define our worker
const workerLogic = () => {
  self.onmessage = e => {
    const src = e.data;
    const sender = self;

    const onLoad = () => {
      sender.postMessage({success: true, src});
    };

    const onError = err => {
      sender.postMessage({success: false, error: err.message});
    };

    try {
      fetch(src, {mode: 'no-cors'})
        .then(onLoad)
        .catch(onError);
    } catch (err) {
      onError(err);
    }
  };
};

let code = workerLogic.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

const blob = new Blob([code], {type: 'application/javascript'});
const workerScript = URL.createObjectURL(blob);

export default class WorkerImage extends Component {
  constructor(props) {
    super(props);

    this.initializeWorker();
    this.state = {src: ''}; // this would be a good place for a placeholder
  }

  componentDidMount() {
    this.mounted = true;
    this.loadImage();
  }

  componentDidUpdate(prevProps) {
    if (!this.mounted) {
      return;
    }

    if (this.props.src !== prevProps.src) {
      this.loadImage();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  // helpers
  initializeWorker() {
    this.worker = new Worker(workerScript);
    this.worker.onmessage = ({data: {success, src, error}}) => {
      if (success) {
        this.setState({src});
      } else if (error) {
        console.error(error);
      }
    };
  }

  loadImage() {
    this.worker.postMessage(this.props.src);
  }

  // render
  render() {
    const {src} = this.state;

    if (src.length === 0) {
      return null;
    }

    return (
      <img src={src} />
    );
  }
}
```
Although a little naive, this allows us to easily spin through a list of image src's, creating tags for each, and let them quickly load across multiple threads in the background, while the main thread finishes the render of the page. FWIW, I do have a more complete implementation with a placeholder and error handling in my [Schwankie.com](https://www.schwankie.com) source linked below.

### Caveats
There is one other attempt at this approach that I know of which is [react-worker-image](https://github.com/nitish24p/react-worker-image), but the resultant html isn't quite to my personal preferences. That said, neither "library" attempts to address concerns like lazy loading, connection speed based scaling, or resolution based scaling. All of these are are important considerations as well. As with most choices in programming, your mileage may vary, and you should choose the right approach for your problem. There is no one package to rule them all.

### Closing
In less than 100 lines of code, we accomplished the goal I set at the start of this article. We are able to quickly speed up the load of the page, provide a better user experience, and optimize the resources available to our site. The other advantage of this approach is that it can be applied to more than just images - json, files, etc could be wrapped by the same approach.

### Attribution
* [Schwankie.com source](https://github.com/jgretz/schwankie)
* [Photo from Pexels](https://www.pexels.com/photo/traffic-car-vehicle-speed-8775/)