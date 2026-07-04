import * as React from 'react';
import { Icon, Callout, IconButton, Stack } from '@fluentui/react';

import type { IHeaderStrings } from '../models/IHeaderStrings';
import type { IAppLauncherItem } from '../models/IHeaderServices';
import { sanitizeUrl } from '../utils/url';
import { emitNavigationTelemetry } from '../utils/navigationTelemetry';
import styles from './HeaderTools.module.scss';

export interface IAppLauncherToolProps {
  strings: IHeaderStrings;
  items: IAppLauncherItem[];
}

const AppLauncherTool: React.FC<IAppLauncherToolProps> = (props) => {
  const { strings, items } = props;
  const [isCalloutVisible, setIsCalloutVisible] = React.useState(false);
  const [buttonElement, setButtonElement] = React.useState<HTMLElement | null>(null);

  const handleOpen = React.useCallback((): void => {
    setIsCalloutVisible(true);
    emitNavigationTelemetry({
      action: 'app-launcher-open',
      level: 'service'
    });
  }, []);

  const groupedItems = React.useMemo(() => {
    const groups: Record<string, IAppLauncherItem[]> = {};
    items.forEach((item: IAppLauncherItem) => {
      const group = item.group || 'Apps';
      groups[group] = groups[group] ?? [];
      groups[group].push(item);
    });
    return groups;
  }, [items]);

  return (
    <div className={styles.headerTool}>
      <IconButton
        aria-expanded={isCalloutVisible}
        aria-haspopup="dialog"
        ariaLabel={strings.AppLauncherAriaLabel || 'App launcher'}
        className={styles.headerToolButton}
        elementRef={(el): void => setButtonElement(el)}
        iconProps={{ iconName: 'Waffle' }}
        onClick={handleOpen}
        title={strings.AppLauncherAriaLabel || 'App launcher'}
      />

      {isCalloutVisible ? (
        <Callout
          className={styles.appLauncherCallout}
          gapSpace={8}
          onDismiss={(): void => setIsCalloutVisible(false)}
          setInitialFocus
          target={buttonElement}
        >
          <div className={styles.appLauncherContent}>
            <h3 className={styles.calloutTitle}>{strings.AppLauncherAriaLabel || 'Apps'}</h3>
            <Stack tokens={{ childrenGap: 16 }}>
              {Object.keys(groupedItems).map((group: string) => {
                const groupItems = groupedItems[group];
                return (
                <div key={group}>
                  <span className={styles.appLauncherGroupTitle}>{group}</span>
                  <div className={styles.appLauncherGrid}>
                    {groupItems.map((item: IAppLauncherItem) => (
                      <a
                        key={item.id}
                        className={styles.appLauncherItem}
                        href={sanitizeUrl(item.url) || '#'}
                        onClick={(): void =>
                          emitNavigationTelemetry({
                            action: 'app-launcher-click',
                            level: 'service',
                            itemId: item.id,
                            itemLabel: item.label
                          })
                        }
                      >
                        <Icon className={styles.appLauncherIcon} iconName={item.iconName} />
                        <span>{item.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              );
              })}
            </Stack>
          </div>
        </Callout>
      ) : null}
    </div>
  );
};

export default AppLauncherTool;
