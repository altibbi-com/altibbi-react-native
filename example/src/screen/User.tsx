import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  UserType,
  BloodType,
  MaritalStatus,
  BoolString,
  GenderType,
  materialStatusArray,
  bloodTypeArray,
  boolStringArray,
  genderTypeArray,
} from 'react-native-altibbi';
import { Radio } from '../component/radio';

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 15,
    textAlign: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#10e1d0',
    flex: 1,
    borderRadius: 15,
    marginTop: 10,
    height: 40,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewHolder: {
    flexDirection: 'row',
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
});
const User = () => {
  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [gender, setGender] = useState<GenderType>(genderTypeArray[0]);
  const [insuranceId, setInsuranceId] = useState<string>('');
  const [policyNumber, setPolicyNumber] = useState<string>('');
  const [nationalityNumber, setNationalityNumber] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [bloodType, setBloodType] = useState<BloodType>();
  const [smoker, setSmoker] = useState<BoolString>(null);
  const [alcoholic, setAlcoholic] = useState<BoolString>(null);
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>(null);
  const [id, setID] = useState<string>('');
  const [id2, setID2] = useState<string>('');

  return (
    <ScrollView style={{ backgroundColor: '#F3F3F4' }}>
      <View style={{ padding: 20 }}>
        <View style={styles.viewHolder}>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setName(text)}
            value={name}
            placeholder="Name"
          />
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setDateOfBirth(text)}
            value={dateOfBirth}
            placeholder="date of birth"
          />
        </View>
        <View style={styles.viewHolder}>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email"
          />
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setPhoneNumber(text)}
            value={phoneNumber}
            placeholder="phoneNumber"
          />
        </View>
        <View style={styles.viewHolder}>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setInsuranceId(text)}
            value={insuranceId}
            placeholder="insuranceId"
          />
        </View>
        <View style={styles.viewHolder}>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setHeight(text)}
            value={height}
            placeholder="height"
          />
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setWeight(text)}
            value={weight}
            placeholder="weight"
          />
        </View>
        <View style={styles.viewHolder}>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setPolicyNumber(text)}
            value={policyNumber}
            placeholder="policyNumber"
          />
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setNationalityNumber(text)}
            value={nationalityNumber}
            placeholder="nationalityNumber"
          />
        </View>
        <Radio
          pick={[gender, setGender]}
          array={genderTypeArray}
          title={'Gender'}
        />
        <Radio
          pick={[maritalStatus, setMaritalStatus]}
          array={materialStatusArray}
          title={'Marital Status'}
        />
        <Radio
          pick={[alcoholic, setAlcoholic]}
          array={boolStringArray}
          title={'Alcoholic'}
        />
        <Radio
          pick={[smoker, setSmoker]}
          array={boolStringArray}
          title={'Smoker'}
        />
        <Radio
          pick={[bloodType, setBloodType]}
          array={bloodTypeArray}
          title={'Gender'}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            const params: UserType = {
              name,
              phone_number: phoneNumber,
              email,
              date_of_birth: dateOfBirth,
              gender,
              insurance_id: insuranceId,
              policy_number: policyNumber,
              nationality_number: nationalityNumber,
              height,
              weight,
              blood_type: bloodType,
              smoker,
              alcoholic,
              marital_status: maritalStatus,
            };
            createUser(params).then((res) => {
              console.log(res);
            });
          }}
        >
          <Text style={styles.buttonText}>Create User</Text>
        </TouchableOpacity>
        <View style={styles.viewHolder}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (!id || id.length === 0) {
                console.log(id);
                return;
              }
              getUser(id).then((res) => {
                console.log(res);
              });
            }}
          >
            <Text style={styles.buttonText}>Get User By Id</Text>
          </TouchableOpacity>
          <TextInput
            keyboardType={'number-pad'}
            style={styles.textInput}
            onChangeText={(text) => setID(text)}
            value={id}
            placeholder="user Id"
          />
        </View>
        <View style={styles.viewHolder}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              deleteUser(id2).then((res) => {
                console.log(res);
              });
            }}
          >
            <Text style={styles.buttonText}>delete user</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setID2(text)}
            value={id2}
            placeholder="userDeleteId"
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            getUsers(1).then((res) => {
              console.log(res);
            });
          }}
        >
          <Text style={styles.buttonText}>get all users</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default User;
