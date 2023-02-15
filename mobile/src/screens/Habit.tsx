import { useEffect, useState } from "react";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { Alert, FlatList, Text, View } from "react-native";
import dayjs from "dayjs";
import clsx from "clsx";

import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";

import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/Progress.Bar";
import { Checkbox } from "../components/Checkbox";
import { Loading } from "../components/Loading";
import { HabitsEmpty } from "../components/HabitsEmpty";
import { ScrollView } from "react-native-virtualized-view";

interface PossibleHabitsProps {
  id: string;
  title: string;
}

interface Params {
  date: string;
}

interface DayInfoProps {
  completedHabits: string[];
  possibleHabits: {
    id: string;
    title: string;
  }[];
}

export function Habit() {
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([])
  const [Modified, setModified] = useState(false)

  const route = useRoute()
  const { date } = route.params as Params;
  const data = dayInfo?.possibleHabits;

  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf('day').isBefore(new Date());
  const dayOfWeek = parsedDate.format('dddd');
  const dayAndMonth = parsedDate.format('DD/MM');

  const habitsCompleted : number = dayInfo?.completedHabits.filter(i => { 
    return  i !== null
  }).length as number

  let habitsProgress = dayInfo?.possibleHabits?.length ? generateProgressPercentage(dayInfo.possibleHabits.length, habitsCompleted) : 0

  const possibleHabits = dayInfo?.possibleHabits.length as number
  const filterOfHabits = dayInfo?.possibleHabits.map(i =>{
    if(i!== null){
      return {
        id: i.id,
        title: i.title
      }
    }
  }) as PossibleHabitsProps[]

      habitsProgress = possibleHabits ? generateProgressPercentage(possibleHabits, completedHabits.length): 0
  async function fetchHabits() {
    try {
      setLoading(true)
      const response = await api.get('/day', { params: { date } });
      setDayInfo(response.data);
      const filterCompleted = response.data.completedHabits.filter( (i: string) =>{
        return i !== null
      }) 
     
      setCompletedHabits(filterCompleted)
      console.log('aqui: ', filterCompleted)
    } catch (error: any) {
      console.log(error.response)
      Alert.alert('Ops', 'Não foi possível carregar as informações dos hábitos.')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleHabits(habitId: string) {

    try {
      await api.patch(`/habits/${habitId}/toggle`);

      if (completedHabits?.includes(habitId)) {
        setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId));
      } else {
        setCompletedHabits(prevState => [...prevState, habitId]);
      }
      
      
    } catch (error) {
      console.log(error)
      Alert.alert('Ops', 'Não foi possível atualizar o status do hábito.')
    }
  }
  
 function ModifiedState(){
  setModified(!Modified)
 }

  useEffect(() => {
 
      fetchHabits()
      }, [Modified])

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View className={clsx("mt-6", {
            ['opacity-50']: isDateInPast
          })}>
          {
            dayInfo?.possibleHabits ?(
              <ScrollView>
                <FlatList
              data={filterOfHabits}
              renderItem={({item}) =>  <Checkbox 
                key={item.id}
                title={item.title}
                checked={completedHabits?.includes(item.id)}
                onPress={() => handleToggleHabits(item.id)}
                disabled={isDateInPast}
                onRemove={ () => ModifiedState()}
               habitId={item.id}
               isHabit
              />}

              />
              </ScrollView>
            )
            
            : 
            <HabitsEmpty />
          }
        </View>

        {
          isDateInPast && (
            <Text className="text-white mt-10 text-center">
              Você não pode editar hábitos de uma data passada.
            </Text>
          )
        }

    </View>
  )
}