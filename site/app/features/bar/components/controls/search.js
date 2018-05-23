import React from 'react';
import {connect} from 'react-redux';
import {Input, Icon} from 'semantic-ui-react';

import {updateSearch} from '../../actions';
import {searchSelector} from '../../selectors';

const handleSearch = term => event => {
  if (event.key && event.key !== 'Enter') {
    return;
  }

  if (term.length === 0) {
    return;
  }
};

const searchBox = ({search, updateSearch}) => {
  const handler = handleSearch(search);

  const icon = <Icon name="search" inverted circular link onClick={handler} />;

  return (
    <Input
      icon={icon}
      placeholder="Search ..."
      value={search}
      onChange={updateSearch}
      onKeyPress={handler}
    />
  );
};

const mapStateToProps = state => ({
  search: searchSelector(state),
});

export default connect(mapStateToProps, {
  updateSearch,
})(searchBox);
