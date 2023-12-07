#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Altibbi, NSObject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
