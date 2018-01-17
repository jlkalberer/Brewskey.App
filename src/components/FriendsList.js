// @flow

import type { Friend, QueryOptions } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type { Row } from '../stores/DAOListStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { withNavigation } from 'react-navigation';
import { observer } from 'mobx-react';
import DAOListStore from '../stores/DAOListStore';
import { FriendStore } from '../stores/DAOStores';
import FlatList from '../common/FlatList';
import LoaderRow from '../common/LoaderRow';
import UserAvatar from '../common/avatars/UserAvatar';
import ListItem from '../common/ListItem';
import LoadingListFooter from '../common/LoadingListFooter';

type Props = {|
  ListHeaderComponent?: React.Node,
  queryOptions?: QueryOptions,
  showPhoneNumber?: boolean,
|};

type InjectedProps = {|
  navigation: Navigation,
|};

@withNavigation
@observer
class FriendsList extends InjectedComponent<InjectedProps, Props> {
  static defaultProps = {
    queryOptions: {},
  };

  _listStore: DAOListStore<Friend> = new DAOListStore(FriendStore);

  componentWillMount() {
    this._listStore.setQueryOptions({
      ...this.props.queryOptions,
    });

    this._listStore.fetchFirstPage();
  }

  _keyExtractor = (row: Row<Friend>): number => row.key;

  _onListItemPress = (friend: Friend) =>
    this.injectedProps.navigation.navigate('profile', {
      id: friend.friendAccount.id,
    });

  _renderListItem = (friend: Friend): React.Node => (
    <ListItem
      avatar={<UserAvatar userName={friend.friendAccount.userName} />}
      onPress={this._onListItemPress}
      hideChevron
      item={friend}
      title={friend.friendAccount.userName}
      subtitle={
        this.props.showPhoneNumber ? friend.friendAccount.phoneNumber : ''
      }
    />
  );

  _renderRow = ({ item }: { item: Row<Friend> }): React.Node => (
    <LoaderRow loader={item.loader} renderListItem={this._renderListItem} />
  );

  render() {
    return (
      <FlatList
        data={this._listStore.rows}
        keyExtractor={this._keyExtractor}
        ListFooterComponent={
          <LoadingListFooter
            isLoading={this._listStore.isFetchingRemoteCount}
          />
        }
        ListHeaderComponent={this.props.ListHeaderComponent}
        onEndReached={this._listStore.fetchNextPage}
        renderItem={this._renderRow}
      />
    );
  }
}

export default FriendsList;
