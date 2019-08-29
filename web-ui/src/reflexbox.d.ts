// Type definitions for @rebass/grid 6.0
// Project: https://github.com/rebassjs/grid
// Definitions by: Anton Vasin <https://github.com/antonvasin>
//                 Victor Orlov <https://github.com/vittorio>
//                 Louis Hache <https://github.com/lhache>
//                 Adam Lavin <https://github.com/lavoaster>
//                 Erin Noe-Payne <https://github.com/autoric>
//                 akameco <https://github.com/akameco>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.9
declare module 'reflexbox' {
  import * as React from 'react';
  import * as StyledSystem from 'styled-system';
  import { ResponsiveStyleValue, SystemStyleObject } from '@styled-system/css';

  export {};

  type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

  export interface BaseProps extends React.RefAttributes<any> {
    as?: React.ElementType;
    css?:
      | StyledComponents.CSSObject
      | StyledComponents.FlattenSimpleInterpolation
      | string;
  }
  /**
   * The `SxStyleProp` extension `SystemStyleObject` and `Emotion` [style props](https://emotion.sh/docs/object-styles)
   * such that properties that are part of the `Theme` will be transformed to
   * their corresponding values. Other valid CSS properties are also allowed.
   */
  export type SxStyleProp = SystemStyleObject &
    Record<
      string,
      | SystemStyleObject
      | ResponsiveStyleValue<number | string>
      | Record<
          string,
          SystemStyleObject | ResponsiveStyleValue<number | string>
        >
    >;

  export interface SxProps {
    /**
     * The sx prop lets you style elements inline, using values from your theme.
     */
    sx?: SxStyleProp;
  }

  interface BoxKnownProps
    extends BaseProps,
      StyledSystem.SpaceProps,
      StyledSystem.WidthProps,
      StyledSystem.HeightProps,
      StyledSystem.FontSizeProps,
      StyledSystem.ColorProps,
      StyledSystem.FlexProps,
      StyledSystem.OrderProps,
      StyledSystem.AlignSelfProps,
      SxProps {
    variant?: StyledSystem.ResponsiveValue<string>;
  }

  export interface BoxProps
    extends BoxKnownProps,
      Omit<React.HTMLProps<HTMLDivElement>, keyof BoxKnownProps> {}
  export const Box: React.FunctionComponent<BoxProps>;

  interface FlexKnownProps
    extends BoxKnownProps,
      StyledSystem.FlexWrapProps,
      StyledSystem.FlexDirectionProps,
      StyledSystem.AlignItemsProps,
      StyledSystem.JustifyContentProps {}
  export interface FlexProps
    extends FlexKnownProps,
      Omit<React.HTMLProps<HTMLDivElement>, keyof FlexKnownProps> {}
  export const Flex: React.FunctionComponent<FlexProps>;
}
