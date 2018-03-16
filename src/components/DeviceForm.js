// @flow

import type {
  Device,
  DeviceMutator,
  EntityID,
  LoadObject,
  Location,
} from 'brewskey.js-api';
import type { FormProps } from '../common/form/types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormValidationMessage } from 'react-native-elements';
import Button from '../common/buttons/Button';
import SectionContent from '../common/SectionContent';
import { LocationStore } from '../stores/DAOStores';
import { form, FormField } from '../common/form';
import TextField from './TextField';
import LocationPicker from './LocationPicker';
import PickerField from '../common/PickerField';
import DeviceStatePicker from './DeviceStatePicker';

export const validate = (values: DeviceMutator): { [key: string]: string } => {
  const errors = {};

  if (!values.deviceStatus) {
    errors.deviceStatus = 'Status is required!';
  }

  if (!values.deviceType) {
    errors.deviceType = 'Device type is required!';
  }

  if (!values.location) {
    errors.location = 'Location is required!';
  }

  if (!values.name) {
    errors.name = 'Name is required!';
  }

  if (!values.particleId) {
    errors.particleId = 'ParticleID is required!';
  }

  return errors;
};

type Props = {|
  device: $Shape<Device>,
  onSubmit: (values: DeviceMutator) => Promise<void>,
  submitButtonLabel: string,
|};

@form({ validate })
@observer
class DeviceForm extends InjectedComponent<FormProps, Props> {
  @computed
  get _locationsLoader(): LoadObject<Array<LoadObject<Location>>> {
    return LocationStore.getMany();
  }

  render() {
    const { device, submitButtonLabel } = this.props;
    const {
      formError,
      handleSubmit,
      invalid,
      pristine,
      submitting,
    } = this.injectedProps;

    return (
      <KeyboardAwareScrollView>
        <FormField
          component={TextField}
          editable={false}
          initialValue={device.particleId}
          label="Hardware ID"
          name="particleId"
        />
        <FormField
          component={TextField}
          initialValue={device.name}
          label="name"
          name="name"
        />
        <FormField
          component={PickerField}
          initialValue={device.deviceType}
          label="Type"
          name="deviceType"
        >
          <PickerField.Item label="Brewskey box" value="BrewskeyBox" />
          <PickerField.Item label="Onsite" value="Onsite" />
        </FormField>
        <FormField
          component={LocationPicker}
          initialValue={device.location}
          name="locationId"
          parseOnSubmit={(value: Location): EntityID => value.id}
        />
        <FormField
          initialValue={device.deviceStatus}
          component={DeviceStatePicker}
          name="deviceStatus"
        />
        <FormField initialValue={device.id} name="id" />
        <FormValidationMessage>{formError}</FormValidationMessage>
        <SectionContent paddedVertical>
          <Button
            disabled={invalid || pristine || submitting}
            loading={submitting}
            onPress={handleSubmit}
            title={submitButtonLabel}
          />
        </SectionContent>
      </KeyboardAwareScrollView>
    );
  }
}

export default DeviceForm;