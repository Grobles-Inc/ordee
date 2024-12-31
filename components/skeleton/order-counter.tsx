import { Skeleton } from "moti/skeleton";
import { useColorScheme, View } from "react-native";

const SkeletonCommonProps = {
  transition: {
    type: "timing",
    duration: 1000,
  },
} as const;

export const CounterSkeleton = () => {
  const colorScheme = useColorScheme();
  return (
    <View>
      <Skeleton.Group show={true}>
        <Skeleton
          height={80}
          width="100%"
          {...SkeletonCommonProps}
          colorMode={colorScheme === "dark" ? "dark" : "light"}
        />
      </Skeleton.Group>
    </View>
  );
};
