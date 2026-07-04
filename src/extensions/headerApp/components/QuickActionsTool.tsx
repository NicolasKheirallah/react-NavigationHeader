import * as React from 'react';
import { Callout, Icon, IconButton, Stack, TooltipHost } from '@fluentui/react';

import type { IHeaderStrings } from '../models/IHeaderStrings';
import type { IQuickAction } from '../models/IHeaderServices';
import { sanitizeUrl } from '../utils/url';
import { emitNavigationTelemetry } from '../utils/navigationTelemetry';
import styles from './HeaderTools.module.scss';

export interface IQuickActionsToolProps {
  strings: IHeaderStrings;
  actions: IQuickAction[];
}

const QuickActionsTool: React.FC<IQuickActionsToolProps> = (props) => {
  const { strings, actions } = props;
  const [isCalloutVisible, setIsCalloutVisible] = React.useState(false);
  const [buttonElement, setButtonElement] = React.useState<HTMLElement | null>(null);

  const visibleActions = actions.slice(0, 5);

  return (
    <div className={styles.headerTool}>
      {visibleActions.length <= 3 ? (
        visibleActions.map((action) => (
          <TooltipHost content={action.label} key={action.id}>
            <IconButton
              ariaLabel={action.label}
              className={styles.headerToolButton}
              iconProps={{ iconName: action.iconName }}
              onClick={(): void => {
                emitNavigationTelemetry({
                  action: 'quick-action-click',
                  level: 'service',
                  itemId: action.id,
                  itemLabel: action.label
                });
                window.open(sanitizeUrl(action.url) || '#', action.target || '_self');
              }}
              title={action.label}
            />
          </TooltipHost>
        ))
      ) : (
        <>
          <IconButton
            aria-expanded={isCalloutVisible}
            aria-haspopup="dialog"
            ariaLabel={strings.QuickActionsAriaLabel || 'Quick actions'}
            className={styles.headerToolButton}
            elementRef={(el): void => setButtonElement(el)}
            iconProps={{ iconName: 'More' }}
            onClick={(): void => {
              setIsCalloutVisible(true);
              emitNavigationTelemetry({
                action: 'quick-actions-open',
                level: 'service'
              });
            }}
            title={strings.QuickActionsAriaLabel || 'Quick actions'}
          />
          {isCalloutVisible ? (
            <Callout
              className={styles.quickActionsCallout}
              gapSpace={8}
              onDismiss={(): void => setIsCalloutVisible(false)}
              setInitialFocus
              target={buttonElement}
            >
              <div className={styles.quickActionsContent}>
                <h3 className={styles.calloutTitle}>{strings.QuickActionsAriaLabel || 'Quick actions'}</h3>
                <Stack tokens={{ childrenGap: 4 }}>
                  {visibleActions.map((action) => (
                    <a
                      key={action.id}
                      className={styles.quickActionItem}
                      href={sanitizeUrl(action.url) || '#'}
                      onClick={(): void =>
                        emitNavigationTelemetry({
                          action: 'quick-action-click',
                          level: 'service',
                          itemId: action.id,
                          itemLabel: action.label
                        })
                      }
                      target={action.target || '_self'}
                    >
                      <Icon className={styles.quickActionIcon} iconName={action.iconName} />
                      <span>{action.label}</span>
                    </a>
                  ))}
                </Stack>
              </div>
            </Callout>
          ) : null}
        </>
      )}
    </div>
  );
};

export default QuickActionsTool;
