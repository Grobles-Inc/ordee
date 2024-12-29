import { Skeleton } from "moti/skeleton";
import { useColorScheme, View } from "react-native";

const SkeletonCommonProps = {
  transition: {
    type: "timing",
    duration: 1000,
  },
} as const;

export const OrderCardSkeleton = () => {
  const colorScheme = useColorScheme();
  return (
    <View>
      <Skeleton.Group show={true}>
        <View className="flex flex-row justify-between items-center">
          <View className="flex flex-row gap-2 items-center">
            <Skeleton
              radius={"round"}
              height={50}
              width={50}
              {...SkeletonCommonProps}
              colorMode={colorScheme === "dark" ? "dark" : "light"}
            />
            <View className="flex flex-col gap-2">
              <Skeleton
                height={20}
                width={80}
                {...SkeletonCommonProps}
                colorMode={colorScheme === "dark" ? "dark" : "light"}
              />
              <Skeleton
                height={15}
                width={100}
                {...SkeletonCommonProps}
                colorMode={colorScheme === "dark" ? "dark" : "light"}
              />
            </View>
            <View />
          </View>
          <Skeleton
            height={30}
            width={110}
            {...SkeletonCommonProps}
            colorMode={colorScheme === "dark" ? "dark" : "light"}
          />
        </View>
      </Skeleton.Group>
    </View>
  );
};
