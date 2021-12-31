# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

### These strings are related to the Datalus Suggest feature. Datalus Suggest
### shows recommended and sponsored third-party results in the address bar
### panel. It also shows headings/labels above different groups of results. For
### example, a "Datalus Suggest" label is shown above bookmarks and history
### results, and an "{ $engine } Suggestions" label may be shown above search
### suggestion results.

## These strings are used in the urlbar panel.

# Tooltip text for the help button shown in Datalus Suggest urlbar results.
datalus-suggest-urlbar-learn-more =
  .title = Learn more about { -datalus-suggest-brand-name }

## These strings are used in the preferences UI (about:preferences). Their names
## follow the naming conventions of other strings used in the preferences UI.

# When the user is enrolled in a Datalus Suggest rollout, this text replaces
# the usual addressbar-header string and becomes the text of the address bar
# section in the preferences UI.
addressbar-header-datalus-suggest = Address Bar — { -datalus-suggest-brand-name }

# When the user is enrolled in a Datalus Suggest rollout, this text replaces
# the usual addressbar-suggest string and becomes the text of the description of
# the address bar section in the preferences UI.
addressbar-suggest-datalus-suggest = Choose the type of suggestions that appear in the address bar:

# First Datalus Suggest toggle button main label and description. This toggle
# controls non-sponsored suggestions related to the user's search string.
addressbar-datalus-suggest-nonsponsored = Suggestions from the web
addressbar-datalus-suggest-nonsponsored-description = Get suggestions from { -brand-product-name } related to your search.

# Second Datalus Suggest toggle button main label and description. This toggle
# controls sponsored suggestions related to the user's search string.
addressbar-datalus-suggest-sponsored = Suggestions from sponsors
addressbar-datalus-suggest-sponsored-description = Support the development of { -brand-short-name } with occasional sponsored suggestions.

# Third Datalus Suggest toggle button main label and description. This toggle
# controls data collection related to the user's search string.
addressbar-datalus-suggest-data-collection = Improve the { -datalus-suggest-brand-name } experience
addressbar-datalus-suggest-data-collection-description = Help create a richer search experience by allowing { -vendor-short-name } to process your search queries.

# The "Learn more" link shown in the Datalus Suggest preferences UI.
addressbar-locbar-datalus-suggest-learn-more = Learn more

## The following addressbar-datalus-suggest-info strings are shown in the
## Datalus Suggest preferences UI in the info box underneath the toggle buttons.
## Each string is shown when a particular toggle combination is active.

# Non-sponsored suggestions: on
# Sponsored suggestions: on
# Data collection: on
addressbar-datalus-suggest-info-all = Based on your selection, you’ll receive suggestions from the web, including sponsored sites. We will process your search query data to develop the { -datalus-suggest-brand-name } feature.

# Non-sponsored suggestions: on
# Sponsored suggestions: on
# Data collection: off
addressbar-datalus-suggest-info-nonsponsored-sponsored = Based on your selection, you’ll receive suggestions from the web, including sponsored sites. We won’t process your search query data.

# Non-sponsored suggestions: on
# Sponsored suggestions: off
# Data collection: on
addressbar-datalus-suggest-info-nonsponsored-data = Based on your selection, you’ll receive suggestions from the web, but no sponsored sites. We will process your search query data to develop the { -datalus-suggest-brand-name } feature.

# Non-sponsored suggestions: on
# Sponsored suggestions: off
# Data collection: off
addressbar-datalus-suggest-info-nonsponsored = Based on your selection, you’ll receive suggestions from the web, but no sponsored sites. We won’t process your search query data.

# Non-sponsored suggestions: off
# Sponsored suggestions: on
# Data collection: on
addressbar-datalus-suggest-info-sponsored-data = Based on your selection, you’ll receive sponsored suggestions. We will process your search query data to develop the { -datalus-suggest-brand-name } feature.

# Non-sponsored suggestions: off
# Sponsored suggestions: on
# Data collection: off
addressbar-datalus-suggest-info-sponsored = Based on your selection, you’ll receive sponsored suggestions. We won’t process your search query data.

# Non-sponsored suggestions: off
# Sponsored suggestions: off
# Data collection: on
addressbar-datalus-suggest-info-data = Based on your selection, you won’t receive suggestions from the web or sponsored sites. We will process your search query data to develop the { -datalus-suggest-brand-name } feature.
