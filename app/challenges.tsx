import ChallengeGenerator from '@/components/ChallengeGenerator';
import { ChallengesStyles } from '@/styles/Challenges.styles';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ChallengesScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[ChallengesStyles.container, { paddingTop: insets.top }]}>
      <ChallengeGenerator />
    </View>
  );
};

export default ChallengesScreen;



