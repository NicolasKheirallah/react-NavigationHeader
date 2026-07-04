import * as React from 'react';
import { Callout, IconButton, Slider, Stack, Toggle } from '@fluentui/react';

import type { IHeaderStrings } from '../models/IHeaderStrings';
import { emitNavigationTelemetry } from '../utils/navigationTelemetry';
import styles from './HeaderTools.module.scss';

export interface IAccessibilityToolProps {
  strings: IHeaderStrings;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
  fontScale: number;
  onChangeFontScale: (value: number) => void;
}

const AccessibilityTool: React.FC<IAccessibilityToolProps> = (props) => {
  const { strings, isHighContrast, onToggleHighContrast, fontScale, onChangeFontScale } = props;
  const [isCalloutVisible, setIsCalloutVisible] = React.useState(false);
  const [buttonElement, setButtonElement] = React.useState<HTMLElement | null>(null);

  const handleScaleChange = React.useCallback(
    (value: number): void => {
      onChangeFontScale(value);
      emitNavigationTelemetry({
        action: 'accessibility-font-scale',
        level: 'service',
        metadata: { scale: value }
      });
    },
    [onChangeFontScale]
  );

  const handleToggle = React.useCallback((): void => {
    onToggleHighContrast();
    emitNavigationTelemetry({
      action: 'accessibility-high-contrast',
      level: 'service',
      metadata: { enabled: !isHighContrast }
    });
  }, [isHighContrast, onToggleHighContrast]);

  return (
    <div className={styles.headerTool}>
      <IconButton
        aria-expanded={isCalloutVisible}
        aria-haspopup="dialog"
        ariaLabel={strings.AccessibilityToolsAriaLabel || 'Accessibility tools'}
        className={styles.headerToolButton}
        elementRef={(el): void => setButtonElement(el)}
        iconProps={{ iconName: 'Accessibility' }}
        onClick={(): void => setIsCalloutVisible(!isCalloutVisible)}
        title={strings.AccessibilityToolsAriaLabel || 'Accessibility tools'}
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
            <h3 className={styles.calloutTitle}>{strings.AccessibilityToolsAriaLabel || 'Accessibility'}</h3>
            <Stack tokens={{ childrenGap: 16 }}>
              <Toggle
                checked={isHighContrast}
                label={strings.HighContrastLabel || 'High contrast'}
                onChange={handleToggle}
              />
              <div>
                <label className={styles.accessibilityLabel} htmlFor="font-size-slider">
                  {strings.TextSizeLabel || 'Text size'}
                </label>
                <Slider
                  id="font-size-slider"
                  max={150}
                  min={80}
                  step={10}
                  value={fontScale}
                  onChange={handleScaleChange}
                />
                <span className={styles.accessibilityValue}>{fontScale}%</span>
              </div>
            </Stack>
          </div>
        </Callout>
      ) : null}
    </div>
  );
};

export default AccessibilityTool;
