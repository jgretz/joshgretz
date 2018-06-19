## Azure Cosmos DB SQL
Azure Cosmos DB is a relatively new offering from Microsoft. It appears to have the goal of being the one cloud storage option to rule them all - offering multiple database options under the [Cosmos DB umbrella](https://docs.microsoft.com/en-us/azure/cosmos-db/introduction).

While the mongodb and graph offerings seem to be on par with other offerings out there, the SQL option intrigued me. Although, I have used document databases before, they have typically been too simplistic for my needs. Cosmos DB adds a couple of thing that piqued my interest, such as automatic indexes, millisecond response times, and the power of sql to query the documents. When I first heard about it, I happened to have a personal project that I was starting, and Cosmos DB SQL appeared to have enough promise to give it a try.

This article will be a combination tutorial & review of Cosmos DB SQL based on my experiences building that project.

### The Project - [Schwankie.com](https://www.schwankie.com)
I drink nearly continuously from the information firehouse that is the internet. Through Twitter, HackerNews, Reddit, and a myriad of email aggregating newsletters, I head down forty to fifty rabbit trails a day. For years, I've used bookmarks to keep record of the sites I thought might be useful someday. The problem was that as quickly as my collection of bookmarks grew, my ability to find anything decreased just as rapidly. After living this way for too long, I set out to build my own indexible, searchable collection. I'm pleased with the end result - which one of my friends designated my own "personal tech Pinterest".

### The Build
#### Background
I decided to use react for the site, and node for the backend (which is my normal setup these days). I use express as my server framework (wrapped in another of my personal projects - [node-bits](https://github.com/jgretz/node-bits)).

The object map is pretty simply, consisting of single object - Link. It has the basic properties that you would expect (url, title, description, image). It also has a property "tag", which is an array of strings - which is the most interesting piece of the object. It's modeled as you would expect in a document - which coming from a background using RDBMSs feels weird

I wanted to be able to categorize my links, something I had always tried to do unsuccessfully with folders, and tags provide me with the flexibility I want. Storing tags is always a fun discussion in a relational database - do you favor normalization, denormalize for performance, or take some other approach? A document database essentially make this decision for you, but querying is typically a bit of a pain syntactically and performance is always a concern. Smoothly handling this situation is where Cosmos DB really impressed me.

#### Getting Started
As with any Azure service, the first thing you need is an Azure account - which is free to setup. Once you have yours created, head to the [Azure Portal](https://portal.azure.com). Setup is pretty straight forward from there:

* On the left hand menu, find Azure Cosmos DB
* Click Add, choosing SQL as the API

At this point, we are ready to create our first collection and start storing data. But first, we have to decide how to connect our node application to our newly minted Cosmos DB SQL instance. The Azure docs will point you towards using [documentdb](https://www.npmjs.com/package/documentdb) package. Although there is nothing wrong with this package, it's reliance on callbacks does feel a bit dated with modern JS. I expected to find a package that used newer syntax such as async/await out there, but was unable to find one - so I wrote one: [cosmos-sql](https://www.npmjs.com/package/cosmos-sql). I wrote a decent amount of documentation in the library, so I won't rehash that too much here, but in short:

* Provide the library with the configuration information such as uri, keys, database name.
* List out the collections you want to access
    * cosmos-sql will automatically create them with default values, so if you are particular create them by hand in the portal first.

Success - you have collections defined and are ready to go.

#### Managing Data
Managing data is pretty straight forward. I'll let the docs speak to the syntax - its just calling create, update, and delete functions on the desired collection.

Since we are dealing with JSON documents, the JS syntax is clean and easy.

#### Querying Data
This is where Cosmos DB SQL really comes into its own - Microsoft has implemented a pretty large portion of the [SQL specification](https://docs.microsoft.com/en-us/azure/cosmos-db/sql-api-sql-query-reference) to allow you to query your collection(s).

The one particular function that I found extremely helpful in this build was ARRAY_CONTAINS. As I mentioned earlier, I am storing my tags an array of strings on the document. This simple function allows me to quickly search across my entire list of links by tag with one simple where clause - straight forward and powerful.

Initially, I was concerned that given that basically all of search is string comparison, that performance would suffer. The results where impressive though, with most requests coming back in the 150 to 200 millisecond time frame.

One drawback I did run into though was around ordering. I'm guessing it's due to the indexing (which is a fair tradeoff imo), but all fields in the ORDER BY clause have to actually exist on the document. This might initially sound ok, but it prevents you from using calculated values (such as SUM, MAX, etc). It's minor and you can get around it after retrieving the data, but it would make a nice addition.

### Retrospective
As is probably clear from the above writing, I found Azure Cosmos DB SQL to be easy to stand up, query, and extremely responsive. In situations that call for a document database, I'd definitely be inclined to use it again. Obviously, there are a lot of cases out there that preclude it's use, but as document databases, it's very solid.

Perhaps its best use, though, is as a scratch pad. Often when I'm at the start of a project, I am doing proof of concept work, and the time it can take to standup a "real" database probably isn't worth the value I get from it. I've started using Cosmos DB SQL in these situations, and it has let me focus on the concept I am trying to prove rather than the plumbing.

### Attribution
* [Schwankie.com Source](https://github.com/jgretz/schwankie)
* [Azure Cosmos DB SQL Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/introduction)
* [Photo from Pexels](https://www.pexels.com/photo/night-computer-hard-drive-hdd-15798/)