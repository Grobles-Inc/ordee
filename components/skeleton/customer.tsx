import { Skeleton } from "moti/skeleton";
import { useColorScheme, View } from "react-native";
import { Divider } from "react-native-paper";

const SkeletonCommonProps = {
  transition: {
    type: "timing",
    duration: 1000,
  },
} as const;

export const CustomerSkeleton = () => {
  const colorScheme = useColorScheme();
  return (
    <View className="border border-zinc-200 dark:border-zinc-500 rounded-xl p-2">
      <Skeleton.Group show={true}>
        <View className="flex flex-row justify-between items-center">
          <View className="flex flex-row gap-2 items-center">
            <Skeleton
              radius={10}
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
            </View>
            <View />
          </View>
        </View>
        <Divider className="my-4" />
        <View className="flex flex-row items-center justify-between">
          <Skeleton
            height={20}
            width={100}
            {...SkeletonCommonProps}
            colorMode={colorScheme === "dark" ? "dark" : "light"}
          />
          <Skeleton
            height={20}
            width={100}
            {...SkeletonCommonProps}
            colorMode={colorScheme === "dark" ? "dark" : "light"}
          />
        </View>
      </Skeleton.Group>
    </View>
  );
};
