import React, { useState, useContext, createContext } from "react";
import { Text, Box, Color, render, useInput } from "ink";
import TextInput from "ink-text-input";
import got from "got";

// This is just a quick demo, no proper error handling whatsoever :P
// Check out wiki-cli

const search = async query => {
  try {
    const response = await got(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&generator=prefixsearch&prop=pageprops%7Cdescription&redirects=&ppprop=displaytitle&gpssearch=${query}&gpsnamespace=0&gpslimit=6`
    );
    const rawResults = JSON.parse(response.body);
    const pages = Object.values(rawResults.query.pages).sort(
      (a, b) => a.index - b.index
    );
    return pages;
  } catch {
    return [];
  }
};

const handleKeypress = (_, key, appContext) => {
  if (!key) return;
  const { selectedId, setSelectedId } = appContext;

  if (key.upArrow) {
    selectedId > -1 && setSelectedId(selectedId - 1);
  }

  if (key.downArrow) {
    selectedId < appContext.results.length - 1 && setSelectedId(selectedId + 1);
  }
};

const AppContext = createContext({
  results: [],
  setResults: () => {},
  selectedId: -1,
  setSelectedId: () => {},
  input: "",
  setInput: () => {}
});

const handleChange = async (value, appContext) => {
  appContext.setInput(value);
  const results = await search(value);
  appContext.setResults(results);
  appContext.setSelectedId(-1);
};

const InstantSearchBar = () => {
  const appContext = useContext(AppContext);
  return (
    <Box marginY={1}>
      <Text bold>Keywords: </Text>
      <TextInput
        value={appContext.input}
        onChange={value => handleChange(value, appContext)}
      />
    </Box>
  );
};

const ResultsListing = () => {
  const appContext = useContext(AppContext);
  return (
    <Box marginY={1} flexDirection="column">
      {appContext.results.map((result, i) => (
        <ResultCard
          result={result}
          key={i}
          isSelected={appContext.selectedId === i}
        />
      ))}
    </Box>
  );
};

const ResultCard = ({ result, isSelected }) => {
  return (
    <Box marginBottom={1}>
      <Box flexDirection="column">
        <Color blue bgRed={isSelected}>
          <Text bold>{result.title}</Text>
        </Color>
        <Box textWrap="wrap">{result.description}</Box>
      </Box>
    </Box>
  );
};

const StatusInfoBar = () => {
  const appContext = useContext(AppContext);
  return (
    <Box marginY={1}>
      {!!appContext.results.length && (
        <Color gray>
          <Text bold>Found {appContext.results.length} results!</Text>
        </Color>
      )}
    </Box>
  );
};

const Wiki = () => {
  const [results, setResults] = useState([]);
  const [selectedId, setSelectedId] = useState(-1);
  const [input, setInput] = useState("");
  useInput((_, key) =>
    handleKeypress(_, key, {
      results,
      setResults,
      selectedId,
      setSelectedId,
      input,
      setInput
    })
  );

  return (
    <AppContext.Provider
      value={{
        results,
        setResults,
        selectedId,
        setSelectedId,
        input,
        setInput
      }}
    >
      <Box flexDirection="column">
        <InstantSearchBar />
        <ResultsListing />
        <StatusInfoBar />
      </Box>
    </AppContext.Provider>
  );
};

render(<Wiki />);
