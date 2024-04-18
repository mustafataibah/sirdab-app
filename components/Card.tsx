import React, { useState, useEffect, useRef } from "react";
import { FlatList, ListRenderItem, Text, TouchableOpacity, View, Image } from "react-native";
import { Link } from "expo-router";
import Animated from "react-native-reanimated";
import { FadeInRight, FadeOutLeft } from "react-native-reanimated";

interface Props {
  bike: any[];
}
const Card = ({ bike }: Props) => {
  const [loading, setLoading] = useState(false);
  const cardRef = useRef<FlatList>(null);

  // useEffect(() => {
  //   setLoading(true);
  //   // fetch data
  //   setLoading(false);
  // }, []);

  const renderItem: ListRenderItem<any> = ({ item }) => (
    <Link href={`/listing/${item.id}`} asChild>
      <TouchableOpacity>
        <Animated.View className="p-4 gap-3 my-4" entering={FadeInRight} exiting={FadeOutLeft}>
          <Image
            source={require("@/assets/images/bikeimage.png")}
            className="w-[350px] h-[200px] rounded-xl bg-red-500"
          />

          <View className="flex flex-row justify-between">
            <Text className="text-md">{item.name}</Text>
            <Text>Some Icon</Text>
          </View>

          <View className="flex flex-col">
            <Text className="text-md">price</Text>
            <Text>Some Icon2</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View className="flex-1 bg-green-200">
      {/* showsVerticalScrollIndicator={false} */}
      <FlatList renderItem={renderItem} ref={cardRef} data={loading ? [] : bike} />
    </View>
  );
};

export default Card;
