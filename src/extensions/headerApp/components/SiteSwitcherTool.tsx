import * as React from 'react';
import { Button, Popover, PopoverTrigger, PopoverSurface } from '@fluentui/react-components';
import { Organization24Regular } from '@fluentui/react-icons';
import { Icon } from '@fluentui/react';

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
  const [open, setOpen] = React.useState(false);

  const siteItems = React.useMemo(() => {
    const candidates = items.filter((item) =>
      item.group?.toLowerCase() === 'divisions' ||
      item.group?.toLowerCase() === 'local sites' ||
      item.group?.toLowerCase() === 'sites'
    );
    return candidates.length > 0 ? candidates : items.slice(0, 8);
  }, [items]);

  const handleOpenChange = React.useCallback((e: unknown, data: { open: boolean }): void => {
    setOpen(data.open);
    if (data.open) {
      emitNavigationTelemetry({
        action: 'site-switcher-open',
        level: 'service'
      });
    }
  }, []);

  return (
    <div className={styles.headerTool}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger>
          <Button
            className={styles.headerToolButton}
            icon={<Organization24Regular />}
            appearance="subtle"
            title={strings.SiteSwitcherAriaLabel || 'Switch site'}
          />
        </PopoverTrigger>
        <PopoverSurface className={styles.siteSwitcherCallout}>
          <div className={styles.siteSwitcherContent}>
            <h3 className={styles.calloutTitle}>{strings.SiteSwitcherAriaLabel || 'Switch site'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
            </div>
          </div>
        </PopoverSurface>
      </Popover>
    </div>
  );
};

export default SiteSwitcherTool;
