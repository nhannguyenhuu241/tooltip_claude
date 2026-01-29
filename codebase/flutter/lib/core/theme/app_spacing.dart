import 'package:flutter/material.dart';

class AppSpacing {
  static const double space2 = 2.0;
  static const double space4 = 4.0;
  static const double space6 = 6.0;
  static const double space8 = 8.0;
  static const double space10 = 10.0;
  static const double space12 = 12.0;
  static const double space14 = 14.0;
  static const double space16 = 16.0;
  static const double space18 = 18.0;
  static const double space20 = 20.0;
  static const double space24 = 24.0;
  static const double space28 = 28.0;
  static const double space32 = 32.0;
  static const double space36 = 36.0;
  static const double space40 = 40.0;
  static const double space48 = 48.0;
  static const double space56 = 56.0;
  static const double space64 = 64.0;
  static const double space72 = 72.0;
  static const double space80 = 80.0;
  
  static const EdgeInsets paddingZero = EdgeInsets.zero;
  
  static const EdgeInsets paddingAll4 = EdgeInsets.all(space4);
  static const EdgeInsets paddingAll8 = EdgeInsets.all(space8);
  static const EdgeInsets paddingAll12 = EdgeInsets.all(space12);
  static const EdgeInsets paddingAll16 = EdgeInsets.all(space16);
  static const EdgeInsets paddingAll20 = EdgeInsets.all(space20);
  static const EdgeInsets paddingAll24 = EdgeInsets.all(space24);
  static const EdgeInsets paddingAll32 = EdgeInsets.all(space32);
  
  static const EdgeInsets paddingHorizontal4 = EdgeInsets.symmetric(horizontal: space4);
  static const EdgeInsets paddingHorizontal8 = EdgeInsets.symmetric(horizontal: space8);
  static const EdgeInsets paddingHorizontal12 = EdgeInsets.symmetric(horizontal: space12);
  static const EdgeInsets paddingHorizontal16 = EdgeInsets.symmetric(horizontal: space16);
  static const EdgeInsets paddingHorizontal20 = EdgeInsets.symmetric(horizontal: space20);
  static const EdgeInsets paddingHorizontal24 = EdgeInsets.symmetric(horizontal: space24);
  static const EdgeInsets paddingHorizontal32 = EdgeInsets.symmetric(horizontal: space32);
  
  static const EdgeInsets paddingVertical4 = EdgeInsets.symmetric(vertical: space4);
  static const EdgeInsets paddingVertical8 = EdgeInsets.symmetric(vertical: space8);
  static const EdgeInsets paddingVertical12 = EdgeInsets.symmetric(vertical: space12);
  static const EdgeInsets paddingVertical16 = EdgeInsets.symmetric(vertical: space16);
  static const EdgeInsets paddingVertical20 = EdgeInsets.symmetric(vertical: space20);
  static const EdgeInsets paddingVertical24 = EdgeInsets.symmetric(vertical: space24);
  static const EdgeInsets paddingVertical32 = EdgeInsets.symmetric(vertical: space32);
  
  static const EdgeInsets paddingTop4 = EdgeInsets.only(top: space4);
  static const EdgeInsets paddingTop8 = EdgeInsets.only(top: space8);
  static const EdgeInsets paddingTop12 = EdgeInsets.only(top: space12);
  static const EdgeInsets paddingTop16 = EdgeInsets.only(top: space16);
  static const EdgeInsets paddingTop20 = EdgeInsets.only(top: space20);
  static const EdgeInsets paddingTop24 = EdgeInsets.only(top: space24);
  static const EdgeInsets paddingTop32 = EdgeInsets.only(top: space32);
  
  static const EdgeInsets paddingBottom4 = EdgeInsets.only(bottom: space4);
  static const EdgeInsets paddingBottom8 = EdgeInsets.only(bottom: space8);
  static const EdgeInsets paddingBottom12 = EdgeInsets.only(bottom: space12);
  static const EdgeInsets paddingBottom16 = EdgeInsets.only(bottom: space16);
  static const EdgeInsets paddingBottom20 = EdgeInsets.only(bottom: space20);
  static const EdgeInsets paddingBottom24 = EdgeInsets.only(bottom: space24);
  static const EdgeInsets paddingBottom32 = EdgeInsets.only(bottom: space32);
  
  static const EdgeInsets paddingLeft4 = EdgeInsets.only(left: space4);
  static const EdgeInsets paddingLeft8 = EdgeInsets.only(left: space8);
  static const EdgeInsets paddingLeft12 = EdgeInsets.only(left: space12);
  static const EdgeInsets paddingLeft16 = EdgeInsets.only(left: space16);
  static const EdgeInsets paddingLeft20 = EdgeInsets.only(left: space20);
  static const EdgeInsets paddingLeft24 = EdgeInsets.only(left: space24);
  static const EdgeInsets paddingLeft32 = EdgeInsets.only(left: space32);
  
  static const EdgeInsets paddingRight4 = EdgeInsets.only(right: space4);
  static const EdgeInsets paddingRight8 = EdgeInsets.only(right: space8);
  static const EdgeInsets paddingRight12 = EdgeInsets.only(right: space12);
  static const EdgeInsets paddingRight16 = EdgeInsets.only(right: space16);
  static const EdgeInsets paddingRight20 = EdgeInsets.only(right: space20);
  static const EdgeInsets paddingRight24 = EdgeInsets.only(right: space24);
  static const EdgeInsets paddingRight32 = EdgeInsets.only(right: space32);
  
  static EdgeInsets paddingOnly({
    double? left,
    double? top,
    double? right,
    double? bottom,
  }) {
    return EdgeInsets.only(
      left: left ?? 0,
      top: top ?? 0,
      right: right ?? 0,
      bottom: bottom ?? 0,
    );
  }
  
  static const SizedBox horizontalSpace2 = SizedBox(width: space2);
  static const SizedBox horizontalSpace4 = SizedBox(width: space4);
  static const SizedBox horizontalSpace8 = SizedBox(width: space8);
  static const SizedBox horizontalSpace12 = SizedBox(width: space12);
  static const SizedBox horizontalSpace16 = SizedBox(width: space16);
  static const SizedBox horizontalSpace20 = SizedBox(width: space20);
  static const SizedBox horizontalSpace24 = SizedBox(width: space24);
  static const SizedBox horizontalSpace32 = SizedBox(width: space32);
  
  static const SizedBox verticalSpace2 = SizedBox(height: space2);
  static const SizedBox verticalSpace4 = SizedBox(height: space4);
  static const SizedBox verticalSpace8 = SizedBox(height: space8);
  static const SizedBox verticalSpace12 = SizedBox(height: space12);
  static const SizedBox verticalSpace16 = SizedBox(height: space16);
  static const SizedBox verticalSpace20 = SizedBox(height: space20);
  static const SizedBox verticalSpace24 = SizedBox(height: space24);
  static const SizedBox verticalSpace32 = SizedBox(height: space32);
  static const SizedBox verticalSpace40 = SizedBox(height: space40);
  static const SizedBox verticalSpace48 = SizedBox(height: space48);
  static const SizedBox verticalSpace56 = SizedBox(height: space56);
  static const SizedBox verticalSpace64 = SizedBox(height: space64);
  
  static const double buttonHeight = 48.0;
  static const double inputHeight = 56.0;
  static const double appBarHeight = 56.0;
  static const double bottomNavHeight = 56.0;
  
  static const double borderRadius4 = 4.0;
  static const double borderRadius8 = 8.0;
  static const double borderRadius12 = 12.0;
  static const double borderRadius16 = 16.0;
  static const double borderRadius20 = 20.0;
  static const double borderRadius24 = 24.0;
  static const double borderRadius28 = 28.0;
  static const double borderRadius32 = 32.0;
  
  static const Radius radius4 = Radius.circular(borderRadius4);
  static const Radius radius8 = Radius.circular(borderRadius8);
  static const Radius radius12 = Radius.circular(borderRadius12);
  static const Radius radius16 = Radius.circular(borderRadius16);
  static const Radius radius20 = Radius.circular(borderRadius20);
  static const Radius radius24 = Radius.circular(borderRadius24);
  static const Radius radius28 = Radius.circular(borderRadius28);
  static const Radius radius32 = Radius.circular(borderRadius32);
  
  static const BorderRadius borderRadiusAll4 = BorderRadius.all(radius4);
  static const BorderRadius borderRadiusAll8 = BorderRadius.all(radius8);
  static const BorderRadius borderRadiusAll12 = BorderRadius.all(radius12);
  static const BorderRadius borderRadiusAll16 = BorderRadius.all(radius16);
  static const BorderRadius borderRadiusAll20 = BorderRadius.all(radius20);
  static const BorderRadius borderRadiusAll24 = BorderRadius.all(radius24);
  static const BorderRadius borderRadiusAll28 = BorderRadius.all(radius28);
  static const BorderRadius borderRadiusAll32 = BorderRadius.all(radius32);
}