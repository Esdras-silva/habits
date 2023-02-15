import { Alert, Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { Feather } from '@expo/vector-icons'
import colors from "tailwindcss/colors";
import Animated from "react-native-reanimated";
import  { ZoomIn, ZoomOut } from "react-native-reanimated";
import {HoldItem} from 'react-native-hold-menu'
import { api } from "../lib/axios";

interface Props extends TouchableOpacityProps {
  title: string;
  checked?: boolean;
  onRemove:  () => void 
  habitId: string
  isHabit: boolean
}



export function Checkbox({ title, checked = false,onRemove,habitId,isHabit = true,...rest }: Props) {

    

  async function deleteHabit(habit_Id: string){
      await api.delete(`/habits/${habit_Id}`).then(()=>{
        
      Alert.alert('Apagado com sucesso')
     
      }).catch(e =>{
        Alert.alert('Não foi possivel Apagar')
      console.log(e)
      })
    
  }
 
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="flex-row mb-2 items-center"
      {...rest}
    >
      { checked 
        ?
        <Animated.View 
          className="h-8 w-8 bg-green-500 rounded-lg items-center justify-center"
          entering={ZoomIn}
          exiting={ZoomOut}
        >
          <Feather 
            name="check"
            size={20}
            color={colors.white}
          />
        </Animated.View>
        : 
        <View className="h-8 w-8 bg-zinc-900 rounded-lg" />
      }

     { isHabit ? (
       <View className=" justify-between items-center flex-row w-[80%] p-2">
      
       <Text  className="text-white text-base ml-3 font-semibold text-center">{title}</Text>

       <TouchableOpacity className=""
       onPress={()=> {deleteHabit(habitId), onRemove()}}
       
       >
        <Feather name="trash-2" size={20} color={colors.red['500']}/>
        
       </TouchableOpacity>
     </View>
     ) : (
      <Text className="text-white text-base ml-3 font-semibold ">
        {title}
      </Text>
     )      
     }
    </TouchableOpacity>
  )
}