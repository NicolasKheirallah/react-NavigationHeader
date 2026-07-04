import * as React from 'react';
import { Callout, IconButton, Stack } from '@fluentui/react';

import type { IHeaderStrings } from '../models/IHeaderStrings';
import type { ILanguageOption } from '../models/IHeaderServices';
import { emitNavigationTelemetry } from '../utils/navigationTelemetry';
import styles from './HeaderTools.module.scss';

export interface ILanguageSwitcherToolProps {
  strings: IHeaderStrings;
  languages: ILanguageOption[];
  currentLanguage: string;
  onChangeLanguage: (languageCode: string) => void;
}

const LanguageSwitcherTool: React.FC<ILanguageSwitcherToolProps> = (props) => {
  const { strings, languages, currentLanguage, onChangeLanguage } = props;
  const [isCalloutVisible, setIsCalloutVisible] = React.useState(false);
  const [buttonElement, setButtonElement] = React.useState<HTMLElement | null>(null);

  const current = languages.find((lang) => lang.code === currentLanguage) || languages[0];

  const handleSelect = React.useCallback(
    (code: string): void => {
      onChangeLanguage(code);
      setIsCalloutVisible(false);
      emitNavigationTelemetry({
        action: 'language-change',
        level: 'service',
        metadata: { selectedLanguage: code }
      });
    },
    [onChangeLanguage]
  );

  if (languages.length <= 1) {
    return null;
  }

  return (
    <div className={styles.headerTool}>
      <IconButton
        aria-expanded={isCalloutVisible}
        aria-haspopup="dialog"
        ariaLabel={strings.LanguageSwitcherAriaLabel || 'Change language'}
        className={styles.headerToolButton}
        elementRef={(el): void => setButtonElement(el)}
        iconProps={{ iconName: 'Globe' }}
        onClick={(): void => setIsCalloutVisible(!isCalloutVisible)}
        title={`${strings.LanguageSwitcherAriaLabel || 'Change language'} (${current?.shortLabel || currentLanguage})`}
      >
        <span className={styles.languageShortLabel}>{current?.shortLabel || currentLanguage}</span>
      </IconButton>

      {isCalloutVisible ? (
        <Callout
          className={styles.languageCallout}
          gapSpace={8}
          onDismiss={(): void => setIsCalloutVisible(false)}
          setInitialFocus
          target={buttonElement}
        >
          <div className={styles.languageContent}>
            <h3 className={styles.calloutTitle}>{strings.LanguageSwitcherAriaLabel || 'Language'}</h3>
            <Stack tokens={{ childrenGap: 4 }}>
              {languages.map((language) => (
                <button
                  key={language.code}
                  aria-current={language.code === currentLanguage ? 'true' : undefined}
                  className={styles.languageOption}
                  onClick={(): void => handleSelect(language.code)}
                  type="button"
                >
                  <span className={styles.languageOptionLabel}>{language.label}</span>
                  <span className={styles.languageOptionCode}>{language.shortLabel}</span>
                </button>
              ))}
            </Stack>
          </div>
        </Callout>
      ) : null}
    </div>
  );
};

export default LanguageSwitcherTool;
