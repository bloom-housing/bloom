import { Jurisdiction } from '../dtos/jurisdictions/jurisdiction.dto';
import { FeatureFlagEnum } from '../enums/feature-flags/feature-flags-enum';

export const doAnyJurisdictionHaveFeatureFlagSet = (
  jurisdictions: Jurisdiction[],
  featureFlagName: FeatureFlagEnum,
) => {
  return jurisdictions.some((juris) => {
    return juris.featureFlags.some(
      (flag) => flag.name === featureFlagName && flag.active,
    );
  });
};

export const doJurisdictionHaveFeatureFlagSet = (
  jurisdiction: Jurisdiction,
  featureFlagName: FeatureFlagEnum,
) => {
  return jurisdiction?.featureFlags?.some(
    (flag) => flag.name === featureFlagName && flag.active,
  );
};

export const doAnyJurisdictionHaveFalsyFeatureFlagValue = (
  jurisdictions: Jurisdiction[],
  featureFlagName: FeatureFlagEnum,
) => {
  return jurisdictions.some((juris) => {
    return !juris.featureFlags.some(
      (flag) => flag.name === featureFlagName && flag.active,
    );
  });
};
