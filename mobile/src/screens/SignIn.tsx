import { View as Center, Text, ActivityIndicator } from 'react-native';
import { FontAwesome5} from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import colors from 'tailwindcss/colors'
import Logo from '../assets/logo.svg';
import { TouchableOpacity } from 'react-native';
import { View } from 'react-native';


export function SignIn() {
const { singIn, isUserLoading } = useAuth();
  
 
  
  return (
    <Center className='flex-1 bg-background p-7  items-center'>
      
      <View className='w-full mt-12'>
      <Logo className='max-w-lg' />
      </View>

      <Text className='font-semibold text-white text-3xl mt-24'>
        <Text className='text-violet-400'>Conecte a sua conta</Text> para poder usufruir de um app de hábitos completos para o seu dia a dia.
      </Text>

      <TouchableOpacity
        onPress={singIn}
        className='items-center mt-40 border-2 border-violet-500 px-4 py-2  flex-row rounded-lg w-[75%] h-[60px] justify-center'
      >
        { isUserLoading ?(
          <ActivityIndicator color={colors.violet['500']}/>
        ):
        (
        <>
          <FontAwesome5
          name="google"
          color={colors.violet[500]}
          size={24}
        />

        <Text className=' text-white m-2 font-semibold'>
          ENTRAR COM O GOOGLE
        </Text>
        </>
        )

        }
      </TouchableOpacity>

      <Text className='text-center text-white mt-12'>
        Não utilizamos nenhuma informação além{'\n'}
        do seu e-mail para criação de sua conta.
      </Text>
    </Center>
  );
}