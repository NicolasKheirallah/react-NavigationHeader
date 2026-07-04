import * as React from 'react';
import { Icon, Callout, IconButton, Stack } from '@fluentui/react';

import type { IHeaderStrings } from '../models/IHeaderStrings';
import type { INavigationItem } from '../models/INavigationItem';
import { sanitizeUrl } from '../utils/url';
import { emitNavigationTelemetry } from '../utils/navigationTelemetry';
import styles from './HeaderTools.module.scss';

export interface ISiteSwitcherToolProps {
  strings: IHeaderStrings;
  items: INavigationItem[];
  currentUrl: string;
}

const SiteSwitcherTool: React.FC<ISiteSwitcherToolProps> = (props) => {
  const { strings, items, currentUrl } = props;
  const [isCalloutVisible, setIsCalloutVisible] = React.useState(false);
  const [buttonElement, setButtonElement] = React.useState<HTMLElement | null>(null);

  const siteItems = React.useMemo(() => {
    const candidates = items.filter((item) =>
      item.group?.toLowerCase() === 'divisions' ||
      item.group?.toLowerCase() === 'local sites' ||
      item.group?.toLowerCase() === 'sites'
    );
    return candidates.length > 0 ? candidates : items.slice(0, 8);
  }, [items]);

  return (
    <div className={styles.headerTool}>
      <IconButton
        aria-expanded={isCalloutVisible}
        aria-haspopup="dialog"
        ariaLabel={strings.SiteSwitcherAriaLabel || 'Switch site'}
        className={styles.headerToolButton}
        elementRef={(el): void => setButtonElement(el)}
        iconProps={{ iconName: 'Org' }}
        onClick={(): void => {
          setIsCalloutVisible(true);
          emitNavigationTelemetry({
            action: 'site-switcher-open',
            level: 'service'
          });
        }}
        title={strings.SiteSwitcherAriaLabel || 'Switch site'}
      />

      {isCalloutVisible ? (
        <Callout
          className={styles.siteSwitcherCallout}
          gapSpace={8}
          onDismiss={(): void => setIsCalloutVisible(false)}
          setInitialFocus
          target={buttonElement}
        >
          <div className={styles.siteSwitcherContent}>
            <h3 className={styles.calloutTitle}>{strings.SiteSwitcherAriaLabel || 'Switch site'}</h3>
            <Stack tokens={{ childrenGap: 4 }}>
              {siteItems.map((item) => (
                <a
                  key={item.id}
                  aria-current={item.url && currentUrl.indexOf(item.url) >= 0 ? 'page' : undefined}
                  className={styles.siteSwitcherItem}
                  href={sanitizeUrl(item.url) || '#'}
                  onClick={(): void =>
                    emitNavigationTelemetry({
                      action: 'site-switcher-click',
                      level: 'service',
                      itemId: item.id,
                      itemLabel: item.label
                    })
                  }
                >
                  {item.iconName ? <Icon className={styles.siteSwitcherIcon} iconName={item.iconName} /> : null}
                  <span>{item.label}</span>
                </a>
              ))}
            </Stack>
          </div>
        </Callout>
      ) : null}
    </div>
  );
};

export default SiteSwitcherTool;
