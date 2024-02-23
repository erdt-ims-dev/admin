// Loader.js
import React from 'react';
import { useSelector } from 'react-redux';

function Loader() {
  const isLoading = useSelector(state => state.isLoading);

  if (isLoading) {
    // Render your loading indicator or spinner here
    return <div>Loading...</div>;
  }

  // If not loading, return null or an empty fragment
  return null;
}

export default Loader;
