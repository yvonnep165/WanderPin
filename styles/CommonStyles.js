import { colors } from "./Colors";

export const commonStyles = {
  container: { flex: 1, backgroundColor: colors.white},
};

export const iconStyle = {
  alignSelf: 'center',
  width: 30,
  height: 30,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 9999,
  marginBottom: 2,
  shadowColor: colors.shadowColor,
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.29,
  shadowRadius: 4.65,
  elevation: 7,
}