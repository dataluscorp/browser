/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { CardGrid } from "content-src/components/DiscoveryStreamComponents/CardGrid/CardGrid";
import { CollectionCardGrid } from "content-src/components/DiscoveryStreamComponents/CollectionCardGrid/CollectionCardGrid";
import { CollapsibleSection } from "content-src/components/CollapsibleSection/CollapsibleSection";
import { connect } from "react-redux";
import { DSMessage } from "content-src/components/DiscoveryStreamComponents/DSMessage/DSMessage";
import { DSPrivacyModal } from "content-src/components/DiscoveryStreamComponents/DSPrivacyModal/DSPrivacyModal";
import { DSSignup } from "content-src/components/DiscoveryStreamComponents/DSSignup/DSSignup";
import { DSTextPromo } from "content-src/components/DiscoveryStreamComponents/DSTextPromo/DSTextPromo";
import { Highlights } from "content-src/components/DiscoveryStreamComponents/Highlights/Highlights";
import { HorizontalRule } from "content-src/components/DiscoveryStreamComponents/HorizontalRule/HorizontalRule";
import { Navigation } from "content-src/components/DiscoveryStreamComponents/Navigation/Navigation";
import { PrivacyLink } from "content-src/components/DiscoveryStreamComponents/PrivacyLink/PrivacyLink";
import React from "react";
import { SectionTitle } from "content-src/components/DiscoveryStreamComponents/SectionTitle/SectionTitle";
import { selectLayoutRender } from "content-src/lib/selectLayoutRender";
import { TopSites } from "content-src/components/DiscoveryStreamComponents/TopSites/TopSites";

const ALLOWED_CSS_URL_PREFIXES = [
  "chrome://",
  "resource://",
  "https://img-getpocket.cdn.mozilla.net/",
];
const DUMMY_CSS_SELECTOR = "DUMMY#CSS.SELECTOR";

/**
 * Validate a CSS declaration. The values are assumed to be normalized by CSSOM.
 */
export function isAllowedCSS(property, value) {
  // Bug 1454823: INTERNAL properties, e.g., -moz-context-properties, are
  // exposed but their values aren't resulting in getting nothing. Fortunately,
  // we don't care about validating the values of the current set of properties.
  if (value === undefined) {
    return true;
  }

  // Make sure all urls are of the allowed protocols/prefixes
  const urls = value.match(/url\("[^"]+"\)/g);
  return (
    !urls ||
    urls.every(url =>
      ALLOWED_CSS_URL_PREFIXES.some(prefix => url.slice(5).startsWith(prefix))
    )
  );
}

export class _DiscoveryStreamBase extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onStyleMount = this.onStyleMount.bind(this);
  }

  onStyleMount(style) {
    // Unmounting style gets rid of old styles, so nothing else to do
    if (!style) {
      return;
    }

    const { sheet } = style;
    const styles = JSON.parse(style.dataset.styles);
    styles.forEach((row, rowIndex) => {
      row.forEach((component, componentIndex) => {
        // Nothing to do without optional styles overrides
        if (!component) {
          return;
        }

        Object.entries(component).forEach(([selectors, declarations]) => {
          // Start with a dummy rule to validate declarations and selectors
          sheet.insertRule(`${DUMMY_CSS_SELECTOR} {}`);
          const [rule] = sheet.cssRules;

          // Validate declarations and remove any offenders. CSSOM silently
          // discards invalid entries, so here we apply extra restrictions.
          rule.style = declarations;
          [...rule.style].forEach(property => {
            const value = rule.style[property];
            if (!isAllowedCSS(property, value)) {
              console.error(`Bad CSS declaration ${property}: ${value}`); // eslint-disable-line no-console
              rule.style.removeProperty(property);
            }
          });

          // Set the actual desired selectors scoped to the component
          const prefix = `.ds-layout > .ds-column:nth-child(${rowIndex +
            1}) .ds-column-grid > :nth-child(${componentIndex + 1})`;
          // NB: Splitting on "," doesn't work with strings with commas, but
          // we're okay with not supporting those selectors
          rule.selectorText = selectors
            .split(",")
            .map(
              selector =>
                prefix +
                // Assume :pseudo-classes are for component instead of descendant
                (selector[0] === ":" ? "" : " ") +
                selector
            )
            .join(",");

          // CSSOM silently ignores bad selectors, so we'll be noisy instead
          if (rule.selectorText === DUMMY_CSS_SELECTOR) {
            console.error(`Bad CSS selector ${selectors}`); // eslint-disable-line no-console
          }
        });
      });
    });
  }

  renderComponent(component, embedWidth) {
    const ENGAGEMENT_LABEL_ENABLED = this.props.Prefs.values[
      `discoverystream.engagementLabelEnabled`
    ];

    switch (component.type) {
      case "Message":
        return (
          <DSMessage
            title={component.header && component.header.title}
            subtitle={component.header && component.header.subtitle}
            link_text={component.header && component.header.link_text}
            link_url={component.header && component.header.link_url}
            icon={component.header && component.header.icon}
          />
        );
      case "SectionTitle":
        return <SectionTitle header={component.header} />;
      case "Navigation":
        return (
          <Navigation
            dispatch={this.props.dispatch}
            links={component.properties.links}
            extraLinks={component.properties.extraLinks}
            alignment={component.properties.alignment}
            display_variant={component.properties.display_variant}
            explore_topics={component.properties.explore_topics}
            header={component.header}
            locale={this.props.App.locale}
            newFooterSection={component.newFooterSection}
            privacyNoticeURL={component.properties.privacyNoticeURL}
          />
        );
      case "HorizontalRule":
        return <HorizontalRule />;
      case "PrivacyLink":
        return <PrivacyLink properties={component.properties} />;
      default:
        return <div>{component.type}</div>;
    }
  }

  renderStyles(styles) {
    // Use json string as both the key and styles to render so React knows when
    // to unmount and mount a new instance for new styles.
    const json = JSON.stringify(styles);
    return <style key={json} data-styles={json} ref={this.onStyleMount} />;
  }

  render() {
    // Select layout render data by adding spocs and position to recommendations
    const { layoutRender } = selectLayoutRender({
      state: this.props.DiscoveryStream,
      prefs: this.props.Prefs.values,
      locale: this.props.locale,
    });
    const { config } = this.props.DiscoveryStream;

    // Allow rendering without extracting special components
    if (!config.collapsible) {
      return this.renderLayout(layoutRender);
    }

    // Find the first component of a type and remove it from layout
    const extractComponent = type => {
      for (const [rowIndex, row] of Object.entries(layoutRender)) {
        for (const [index, component] of Object.entries(row.components)) {
          if (component.type === type) {
            // Remove the row if it was the only component or the single item
            if (row.components.length === 1) {
              layoutRender.splice(rowIndex, 1);
            } else {
              row.components.splice(index, 1);
            }
            return component;
          }
        }
      }
      return null;
    };

  
    // Extract TopSites to render before the rest and Message to use for header

    const privacyLinkComponent = extractComponent("PrivacyLink");

    // Render a DS-style TopSites then the rest if any in a collapsible section
    return (
      <React.Fragment>
        {this.props.DiscoveryStream.isPrivacyInfoModalVisible && (
          <DSPrivacyModal dispatch={this.props.dispatch} />
        )}
        {topSites &&
          this.renderLayout([
            {
              width: 12,
              components: [topSites],
            },
          ])}
        {sponsoredCollection &&
          this.renderLayout([
            {
              width: 12,
              components: [sponsoredCollection],
            },
          ])}
        {!!layoutRender.length && (
          <CollapsibleSection
            className="ds-layout"
            collapsed={topStories.pref.collapsed}
            dispatch={this.props.dispatch}
            id={topStories.id}
            isFixed={true}
            learnMore={{
              link: {
                href: message.header.link_url,
                message: message.header.link_text,
              },
            }}
            privacyNoticeURL={topStories.privacyNoticeURL}
            showPrefName={topStories.pref.feed}
            title={message.header.title}
            eventSource="CARDGRID"
          >
            {this.renderLayout(layoutRender)}
          </CollapsibleSection>
        )}
        {this.renderLayout([
          {
            width: 12,
            components: [{ type: "Highlights" }],
          },
        ])}
        {privacyLinkComponent &&
          this.renderLayout([
            {
              width: 12,
              components: [privacyLinkComponent],
            },
          ])}
      </React.Fragment>
    );
  }

  renderLayout(layoutRender) {
    const styles = [];
    return (
      <div className="discovery-stream ds-layout">
        {layoutRender.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={`ds-column ds-column-${row.width}`}
          >
            <div className="ds-column-grid">
              {row.components.map((component, componentIndex) => {
                if (!component) {
                  return null;
                }
                styles[rowIndex] = [
                  ...(styles[rowIndex] || []),
                  component.styles,
                ];
                return (
                  <div key={`component-${componentIndex}`}>
                    {this.renderComponent(component, row.width)}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {this.renderStyles(styles)}
      </div>
    );
  }
}

export const DiscoveryStreamBase = connect(state => ({
  DiscoveryStream: state.DiscoveryStream,
  Prefs: state.Prefs,
  Sections: state.Sections,
  document: global.document,
  App: state.App,
}))(_DiscoveryStreamBase);
