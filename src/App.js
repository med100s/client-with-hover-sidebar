 /* eslint-disable */

import React, { useState } from "react";
import moment from "moment";
// Be sure to include styles at some point, probably during your bootstraping
// import "@trendmicro/react-sidenav/dist/react-sidenav.css";

import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";


import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

import {
  Facet,
  SearchProvider,
  SearchBox,
  Results,
  Sorting,
} from "@elastic/react-search-ui";


import "@elastic/react-search-ui-views/lib/styles/styles.css";

import "./App.css";

const connector = new AppSearchAPIConnector({
  searchKey: "search-371auk61r2bwqtdzocdgutmg",
  engineName: "search-ui-examples",
  hostIdentifier: "host-2376rb",
  endpointBase: "",
});

const config = {
  alwaysSearchOnInitialLoad: false,
  searchQuery: {
    result_fields: {
      visitors: { raw: {} },
      world_heritage_site: { raw: {} },
      location: { raw: {} },
      acres: { raw: {} },
      square_km: { raw: {} },
      title: {
        snippet: {
          size: 100,
          fallback: true,
        },
      },
      nps_link: { raw: {} },
      states: { raw: {} },
      date_established: { raw: {} },
      image_url: { raw: {} },
      description: {
        snippet: {
          size: 100,
          fallback: true,
        },
      },
    },
    disjunctiveFacets: ["acres", "states", "date_established", "location"],
    facets: {
      world_heritage_site: { type: "value" },
      states: { type: "value", size: 30 },
      acres: {
        type: "range",
        ranges: [
          { from: -1, name: "Any" },
          { from: 0, to: 1000, name: "Small" },
          { from: 1001, to: 100000, name: "Medium" },
          { from: 100001, name: "Large" },
        ],
      },
      location: {
        // San Francisco. In the future, make this the user's current position
        center: "37.7749, -122.4194",
        type: "range",
        unit: "mi",
        ranges: [
          { from: 0, to: 100, name: "Nearby" },
          { from: 100, to: 500, name: "A longer drive" },
          { from: 500, name: "Perhaps fly?" },
        ],
      },
      date_established: {
        type: "range",

        ranges: [
          {
            from: moment().subtract(50, "years").toISOString(),
            name: "Within the last 50 years",
          },
          {
            from: moment().subtract(100, "years").toISOString(),
            to: moment().subtract(50, "years").toISOString(),
            name: "50 - 100 years ago",
          },
          {
            to: moment().subtract(100, "years").toISOString(),
            name: "More than 100 years ago",
          },
        ],
      },
      visitors: {
        type: "range",
        ranges: [
          { from: 0, to: 10000, name: "0 - 10000" },
          { from: 10001, to: 100000, name: "10001 - 100000" },
          { from: 100001, to: 500000, name: "100001 - 500000" },
          { from: 500001, to: 1000000, name: "500001 - 1000000" },
          { from: 1000001, to: 5000000, name: "1000001 - 5000000" },
          { from: 5000001, to: 10000000, name: "5000001 - 10000000" },
          { from: 10000001, name: "10000001+" },
        ],
      },
    },
  },
  autocompleteQuery: {
    results: {
      resultsPerPage: 5,
      result_fields: {
        title: {
          snippet: {
            size: 100,
            fallback: true,
          },
        },
        nps_link: {
          raw: {},
        },
      },
    },
    suggestions: {
      types: {
        documents: {
          fields: ["title", "description"],
        },
      },
      size: 4,
    },
  },
  apiConnector: connector,
};

const SORT_OPTIONS = [
  {
    name: "Relevance",
    value: [],
  },
  {
    name: "Title",
    value: [
      {
        field: "title",
        direction: "asc",
      },
    ],
  },
  {
    name: "State",
    value: [
      {
        field: "states",
        direction: "asc",
      },
    ],
  },
  {
    name: "State -> Title",
    value: [
      {
        field: "states",
        direction: "asc",
      },
      {
        field: "title",
        direction: "asc",
      },
    ],
  },
  {
    name: "Heritage Site -> State -> Title",
    value: [
      {
        field: "world_heritage_site",
        direction: "asc",
      },
      {
        field: "states",
        direction: "asc",
      },
      {
        field: "title",
        direction: "asc",
      },
    ],
  },
];

function App() {
  const [isOn, setisOn] = useState(false);

  return (
    <Router>
      <Route
        render={({ location, history }) => (
          <React.Fragment>
            <div id="sidebar">
              <div id="nav-items">
                <a href="/">
                  <img src={"/cbb3ad.png"} />
                  <span>Главная</span>
                </a>
                <a href="/home">
                  <img src={"/cbb3ad.png"} />
                  <span>Домашняя</span>
                </a>
                <a href="/personal">
                  <img src={"/cbb3ad.png"} />
                  <span>Сотрудники</span>
                </a>
                <a href="/clients">
                  <img src={"/cbb3ad.png"} />
                  <span>Клиенты</span>
                </a>
                <a href="/analitics">
                  <img src={"/cbb3ad.png"} />
                  <span>Аналитика</span>
                </a>
              </div>
            </div>
            <main class="main">
              <div></div>

              <SearchProvider config={config}>
                <div class="header" id="header">
                  <SearchBox
                    autocompleteMinimumCharacters={1}
                    //searchAsYouType={true}
                    onSubmit={(searchTerm) => {
                      if (searchTerm == "") return;
                      window.location.href = `/search/?q=${encodeURIComponent(
                        searchTerm
                      )}&size=n_20_n`;
                      console.log(encodeURIComponent(searchTerm));
                    }}
                    autocompleteResults={{
                      linkTarget: "_blank",
                      sectionTitle: "Results",
                      titleField: "title",
                      urlField: "nps_link",
                      shouldTrackClickThrough: true,
                      clickThroughTags: ["test"],
                    }}
                    autocompleteSuggestions={true}
                    debounceLength={0}
                  />
                  <div class="user-credentials">
                    <span>иванов иван иванов</span>
                    <img src={"/cbb3ad.png"} />
                  </div>
                </div>
                <Route
                  path="/search"
                  component={(props) => (
                    <div class="options-menu">
                      <div>
                        <div class="shit">
                          Filter Block
                          <img
                            src={"/options.svg"}
                            class="options"
                            onClick={() => {
                              setisOn(!isOn);
                            }}
                          />
                        </div>
                        <div class={isOn ? "visible" : "invisible"}>
                          <Facet
                            field="states"
                            label="States"
                            filterType="any"
                            isFilterable={true}
                          />
                          <Facet
                            field="states"
                            label="States"
                            filterType="any"
                            isFilterable={true}
                          />
                          <Facet
                            field="states"
                            label="States"
                            filterType="any"
                            isFilterable={true}
                          />
                          
                        </div>
                        
                        <div class={isOn ? "visible" : "invisible"}>
                        <Sorting
                            label={"Sort by"}
                            sortOptions={SORT_OPTIONS}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                />
                <Results
                  titleField="title"
                  urlField="/nps_link/"
                  thumbnailField="image_url"
                  shouldTrackClickThrough={true}
                />
              </SearchProvider>

              <Route path="/" exact component={() => <RootComponent />} />
              <Route path="/home" component={() => <Home />} />
              <Route path="/personal" component={() => <Personal />} />
              <Route path="/clients" component={() => <Clients />} />
              <Route path="/analitics" component={() => <Analitics />} />
            </main>
          </React.Fragment>
        )}
      />
    </Router>
  );
}
function RootComponent() {
  return <div>Главная</div>;
}
function Home() {
  return <div>Домашняя</div>;
}
function Personal() {
  return <div>Сотрудники</div>;
}
function Clients() {
  return <div>Клиенты</div>;
}
function Analitics() {
  return <div>Аналитика</div>;
}

export default App;
