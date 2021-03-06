// @flow

import type { QueryOptions, Location } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type { Row } from '../stores/DAOListStore';
import type { RowItemProps } from '../common/SwipeableRow';

import DAOApi from 'brewskey.js-api';
import { observer } from 'mobx-react';
import nullthrows from 'nullthrows';
import * as React from 'react';
import { withNavigation } from 'react-navigation';
import InjectedComponent from '../common/InjectedComponent';
import ListEmpty from '../common/ListEmpty';
import ListItem from '../common/ListItem';
import LoaderRow from '../common/LoaderRow';
import LoadingListFooter from '../common/LoadingListFooter';
import QuickActions from '../common/QuickActions';
import SwipeableList from '../common/SwipeableList';
import SwipeableRow from '../common/SwipeableRow';
import { NULL_STRING_PLACEHOLDER } from '../constants';
import DAOListStore from '../stores/DAOListStore';
import SnackBarStore from '../stores/SnackBarStore';
import { LocationStore } from '../stores/DAOStores';

type Props = {|
  ListEmptyComponent?: ?(React.ComponentType<any> | React.Node),
  ListHeaderComponent?: ?(React.ComponentType<any> | React.Node),
  queryOptions?: QueryOptions,
|};

type InjectedProps = {|
  navigation: Navigation,
|};

@withNavigation
@observer
class LocationsList extends InjectedComponent<InjectedProps, Props> {
  static defaultProps: {|
    ListEmptyComponent: React.Node,
    queryOptions: QueryOptions,
  |} = {
    ListEmptyComponent: <ListEmpty message="No locations" />,
    queryOptions: {},
  };

  _listStore: DAOListStore<Location> = new DAOListStore(LocationStore);
  _swipeableListRef = React.createRef<SwipeableList<Row<Location>>>();

  componentDidMount() {
    this._listStore.initialize({
      orderBy: [
        {
          column: 'id',
          direction: 'desc',
        },
      ],
      ...this.props.queryOptions,
    });
  }

  _keyExtractor = (row: Row<Location>): string => row.key;

  _onDeleteItemPress = async (item: Location): Promise<void> => {
    const clientID = DAOApi.LocationDAO.deleteByID(item.id);
    await DAOApi.LocationDAO.waitForLoadedNullable((dao) =>
      dao.fetchByID(clientID),
    );
    SnackBarStore.showMessage({ text: 'The location was deleted' });
  };

  _onEditItemPress = ({ id }: Location) => {
    this.injectedProps.navigation.navigate('editLocation', { id });
    nullthrows(this._swipeableListRef.current).resetOpenRow();
  };

  _onItemPress = (item: Location): void =>
    this.injectedProps.navigation.navigate('locationDetails', {
      id: item.id,
    });

  _renderRow = ({
    info: { item: row, index, separators },
    ...swipeableStateProps
  }): React.Node => (
    <LoaderRow
      index={index}
      loadedRow={SwipeableRow}
      loader={row.loader}
      onDeleteItemPress={this._onDeleteItemPress}
      onEditItemPress={this._onEditItemPress}
      onItemPress={this._onItemPress}
      rowItemComponent={SwipeableRowItem}
      separators={separators}
      slideoutComponent={Slideout}
      {...swipeableStateProps}
    />
  );

  render(): React.Node {
    const { ListEmptyComponent, ListHeaderComponent } = this.props;
    const isLoading = this._listStore.isFetchingRemoteCount;

    return (
      <SwipeableList
        data={this._listStore.rows}
        keyExtractor={this._keyExtractor}
        ListEmptyComponent={!isLoading ? ListEmptyComponent : null}
        ListFooterComponent={<LoadingListFooter isLoading={isLoading} />}
        ListHeaderComponent={ListHeaderComponent}
        onEndReached={this._listStore.fetchNextPage}
        onRefresh={this._listStore.reload}
        ref={this._swipeableListRef}
        renderItem={this._renderRow}
      />
    );
  }
}

const SwipeableRowItem = ({
  item,
  onItemPress,
}: RowItemProps<Location>): React.Node => (
  <ListItem
    chevron={false}
    item={item}
    onPress={onItemPress}
    subtitle={item.description || NULL_STRING_PLACEHOLDER}
    title={item.name}
  />
);

const Slideout = ({
  item,
  onDeleteItemPress,
  onEditItemPress,
}: RowItemProps<Location>): React.Node => (
  <QuickActions
    deleteModalMessage={`Are you sure you want to delete ${item.name}?`}
    deleteModalTitle="Delete location"
    item={item}
    onDeleteItemPress={onDeleteItemPress}
    onEditItemPress={onEditItemPress}
  />
);

export default LocationsList;
