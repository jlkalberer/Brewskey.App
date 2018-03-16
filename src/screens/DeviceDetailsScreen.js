// @flow

import type { Device, EntityID, LoadObject } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import DAOApi from 'brewskey.js-api';
import TapsList from '../components/TapsList';
import OverviewItem from '../common/OverviewItem2';
import DeviceStateOverviewItem from '../components/DeviceStateOverviewItem';
import DeviceOnlineOverviewItem from '../components/DeviceOnlineOverviewItem';
import { DeviceStore } from '../stores/DAOStores';
import Container from '../common/Container';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
import Section from '../common/Section';
import SectionHeader from '../common/SectionHeader';
import LoaderComponent from '../common/LoaderComponent';
import LoadingIndicator from '../common/LoadingIndicator';
import Header from '../common/Header';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

type InjectedProps = {|
  id: EntityID,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@observer
class DeviceDetailsScreen extends InjectedComponent<InjectedProps> {
  @computed
  get _deviceLoader(): LoadObject<Device> {
    return DeviceStore.getByID(this.injectedProps.id);
  }

  render() {
    return (
      <LoaderComponent
        updatingComponent={LoadingComponent}
        loadedComponent={LoadedComponent}
        loader={this._deviceLoader}
        loadingComponent={LoadingComponent}
      />
    );
  }
}

const LoadingComponent = () => (
  <Container>
    <Header showBackButton />
    <LoadingIndicator />
  </Container>
);

type LoadedComponentProps = {
  value: Device,
};

const LoadedComponent = observer(
  ({ value: { deviceStatus, id, name, particleId } }: LoadedComponentProps) => (
    <Container>
      <Header
        rightComponent={
          <HeaderNavigationButton
            name="edit"
            params={{ id }}
            toRoute="editDevice"
          />
        }
        showBackButton
        title={name}
      />
      <TapsList
        ListHeaderComponent={
          <Container>
            <Section bottomPadded>
              <OverviewItem title="Box ID" value={particleId} />
              <DeviceStateOverviewItem deviceState={deviceStatus} />
              <DeviceOnlineOverviewItem deviceID={id} />
            </Section>
            <SectionHeader title="Taps" />
          </Container>
        }
        queryOptions={{
          filters: [DAOApi.createFilter('device/id').equals(id)],
        }}
      />
    </Container>
  ),
);

export default DeviceDetailsScreen;