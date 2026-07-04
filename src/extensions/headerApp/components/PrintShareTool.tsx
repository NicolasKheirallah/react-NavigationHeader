import * as React from 'react';
import { Button, Popover, PopoverTrigger, PopoverSurface } from '@fluentui/react-components';
import { Print24Regular } from '@fluentui/react-icons';

import type { IHeaderStrings } from '../models/IHeaderStrings';
import { emitNavigationTelemetry } from '../utils/navigationTelemetry';
import styles from './HeaderTools.module.scss';

export interface IPrintShareToolProps {
  strings: IHeaderStrings;
}

const PrintShareTool: React.FC<IPrintShareToolProps> = (props) => {
  const { strings } = props;
  const [open, setOpen] = React.useState(false);

  const handlePrint = React.useCallback((): void => {
    emitNavigationTelemetry({ action: 'print', level: 'service' });
    setOpen(false);
    window.print();
  }, []);

  const handleShare = React.useCallback((): void => {
    emitNavigationTelemetry({ action: 'share', level: 'service' });
    setOpen(false);

    if (navigator.share) {
      void navigator.share({
        title: document.title,
        url: window.location.href
      });
    } else if (navigator.clipboard) {
      void navigator.clipboard.writeText(window.location.href);
    }
  }, []);

  return (
    <div className={styles.headerTool}>
      <Popover open={open} onOpenChange={(e, data) => setOpen(data.open)}>
        <PopoverTrigger>
          <Button
            className={styles.headerToolButton}
            icon={<Print24Regular />}
            appearance="subtle"
            title={strings.PrintAriaLabel || 'Print or share'}
          />
        </PopoverTrigger>
        <PopoverSurface className={styles.quickActionsCallout}>
          <div className={styles.quickActionsContent}>
            <h3 className={styles.calloutTitle}>{strings.PrintAriaLabel || 'Print or share'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button className={styles.quickActionItem} onClick={handlePrint} type="button">
                <span>{strings.PrintAriaLabel || 'Print'}</span>
              </button>
              <button className={styles.quickActionItem} onClick={handleShare} type="button">
                <span>{strings.ShareAriaLabel || 'Share'}</span>
              </button>
            </div>
          </div>
        </PopoverSurface>
      </Popover>
    </div>
  );
};

export default PrintShareTool;
