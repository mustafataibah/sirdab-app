import React, { useRef } from "react";
import { FlatList, ListRenderItem, Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import Animated from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { useUser } from "@clerk/clerk-expo";
import { useData } from "@/app/context/DataContext";

// Card component to display the list of bicycles
interface Props {
  listings: any[];
  onRefresh: () => void;
  refreshing: boolean;
  color: string;
}

// accepts the listings, onRefresh function, refreshing state, and color as props
const Card = ({ listings: items, onRefresh, refreshing, color }: Props) => {
  const cardRef = useRef<FlatList>(null); // ref for the FlatList component
  const { user } = useUser();
  const { selectedDate, selectedLocation, selectedModel, selectedRating } = useData(); // get the selected filters from the context

  // function to render each item in the list
  const renderItem: ListRenderItem<any> = ({ item }) => {
    // below is the logic to filter the items based on the selected filters simply if the item does not match the filter return null
    const bookingDate = item.currentBookingDate;

    const selectedDateFormatted = selectedDate ? selectedDate.replace(/\//g, "-") : null;

    if (!user?.publicMetadata.isManager && selectedDateFormatted === bookingDate) {
      return null;
    }

    if (!user?.publicMetadata.isManager && color !== "Any" && item.color !== color) {
      return null;
    }

    if (selectedModel !== "All Models" && item.model !== selectedModel) {
      return null;
    }

    if (selectedLocation !== "All Locations" && item.location !== selectedLocation) {
      return null;
    }

    if (selectedRating !== 0 && item.averageRating < selectedRating) {
      return null;
    }

    return (
      <Link href={`/listing/${item.id}`} asChild>
        <TouchableOpacity>
          <Animated.View
            className="p-[16px] gap-[10px] my-[16px] bg-blue-200 rounded-xl shadow-lg mx-[16px]"
            entering={FadeInRight}
            exiting={FadeOutLeft}>
            <View className="items-center justify-center py-10">
              <Animated.Image source={require("@/assets/images/bikeimage.png")} className="w-[300px] rounded-lg" />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 16, fontFamily: "sf-sb" }}>{item.model}</Text>
              <View style={{ flexDirection: "row", gap: 4 }}>
                <Feather name="star" size={16} />
                <Text style={{ fontFamily: "sf-sb" }}>{item.averageRating}</Text>
              </View>
            </View>
            <Text style={{ fontFamily: "sf" }}>{item.color}</Text>
            <View style={{ flexDirection: "row", gap: 4 }}>
              <Text style={{ fontFamily: "sf-sb" }}>$20.75</Text>
              <Text style={{ fontFamily: "sf" }}>/ 24 hours</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Link>
    );
  };

  // return the FlatList component with the renderItem function, ref, data, and header
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        renderItem={renderItem}
        ref={cardRef}
        data={items}
        ListHeaderComponent={
          <Text className="text-center font-semibold text-[16px] mt-[50px]">{items.length} bicycles</Text>
        }
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </View>
  );
};

export default Card;
