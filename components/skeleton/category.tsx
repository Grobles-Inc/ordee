import { Skeleton } from "moti/skeleton";
import { useColorScheme, View } from "react-native";

const SkeletonCommonProps = {
  transition: {
    type: "timing",
    duration: 1000,
  },
} as const;

export const CategorySkeleton = () => {
  const colorScheme = useColorScheme();
  return (
    <View>
      <Skeleton.Group show={true}>
        <View className="flex flex-row justify-between items-center">
          <View className="flex flex-col gap-2 ">
            <View className="flex flex-row gap-2 items-center">
              <View className="flex flex-col gap-2 pl-16">
                <Skeleton
                  height={20}
                  width={80}
                  {...SkeletonCommonProps}
                  colorMode={colorScheme === "dark" ? "dark" : "light"}
                />
              </View>
            </View>
            <Skeleton
              height={30}
              width={300}
              {...SkeletonCommonProps}
              colorMode={colorScheme === "dark" ? "dark" : "light"}
            />
            <View />
          </View>
        </View>
      </Skeleton.Group>
    </View>
  );
};
