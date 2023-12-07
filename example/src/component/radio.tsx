import { Text, TouchableOpacity, View } from 'react-native';

interface RadioType {
  pick: any;
  array: string[];
  title?: string;
}
export const Radio = (props: RadioType) => {
  const [picked, setPicked] = props.pick;
  const { array, title } = props;

  return (
    <>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 18,
          color: 'black',
          marginTop: 20,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          marginTop: 10,
          flexWrap: 'wrap',
        }}
      >
        {array.map((item) => {
          return (
            <TouchableOpacity
              activeOpacity={1}
              key={item}
              style={{ marginRight: 20 }}
              onPress={() => {
                setPicked(item);
              }}
            >
              <Text
                style={{
                  marginTop: 5,
                  fontWeight: 'bold',
                  fontSize: 18,
                  color: item === picked ? '#10e1d0' : '#9d9d9d',
                }}
              >
                {'  ' + item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
};
