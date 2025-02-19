/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, {
  useState,
  ReactElement,
  ReactNode,
  PropsWithChildren,
} from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  withStyles,
  makeStyles,
  Tabs,
  Tab,
  TabProps,
} from '@material-ui/core';
import { BottomLink, BottomLinkProps } from '../BottomLink';
import { ErrorBoundary, ErrorBoundaryProps } from '../ErrorBoundary';

const useTabsStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0, 2, 0, 2.5),
    minHeight: theme.spacing(3),
  },
  indicator: {
    backgroundColor: theme.palette.info.main,
    height: theme.spacing(0.3),
  },
}));

const BoldHeader = withStyles(theme => ({
  root: { padding: theme.spacing(2, 2, 2, 2.5), display: 'inline-block' },
  title: { fontWeight: 700 },
  subheader: { paddingTop: theme.spacing(1) },
}))(CardHeader);

type Props = {
  /** @deprecated Use errorBoundaryProps instead */
  slackChannel?: string;
  errorBoundaryProps?: ErrorBoundaryProps;
  children?: ReactElement<TabProps>[];
  onChange?: (event: React.ChangeEvent<{}>, value: number | string) => void;
  title?: string;
  value?: number | string;
  deepLink?: BottomLinkProps;
};

export function TabbedCard(props: PropsWithChildren<Props>) {
  const {
    slackChannel,
    errorBoundaryProps,
    children,
    title,
    deepLink,
    value,
    onChange,
  } = props;
  const tabsClasses = useTabsStyles();
  const [selectedIndex, selectIndex] = useState(0);

  const handleChange = onChange
    ? onChange
    : (_ev: unknown, newSelectedIndex: number) => selectIndex(newSelectedIndex);

  let selectedTabContent: ReactNode;
  if (!value) {
    React.Children.map(children, (child, index) => {
      if (index === selectedIndex) selectedTabContent = child?.props.children;
    });
  } else {
    React.Children.map(children, child => {
      if (child?.props.value === value)
        selectedTabContent = child?.props.children;
    });
  }

  const errProps: ErrorBoundaryProps =
    errorBoundaryProps || (slackChannel ? { slackChannel } : {});

  return (
    <Card>
      <ErrorBoundary {...errProps}>
        {title && <BoldHeader title={title} />}
        <Tabs
          selectionFollowsFocus
          classes={tabsClasses}
          value={value || selectedIndex}
          onChange={handleChange}
        >
          {children}
        </Tabs>
        <Divider />
        <CardContent>{selectedTabContent}</CardContent>
        {deepLink && <BottomLink {...deepLink} />}
      </ErrorBoundary>
    </Card>
  );
}

const useCardTabStyles = makeStyles(theme => ({
  root: {
    minWidth: theme.spacing(6),
    minHeight: theme.spacing(3),
    margin: theme.spacing(0, 2, 0, 0),
    padding: theme.spacing(0.5, 0, 0.5, 0),
    textTransform: 'none',
    '&:hover': {
      opacity: 1,
      backgroundColor: 'transparent',
      color: theme.palette.text.primary,
    },
  },
  selected: {
    fontWeight: 'bold',
  },
}));

type CardTabProps = TabProps & {
  children: ReactNode;
};

export function CardTab(props: PropsWithChildren<CardTabProps>) {
  const { children, ...restProps } = props;
  const classes = useCardTabStyles();

  return <Tab disableRipple classes={classes} {...restProps} />;
}
