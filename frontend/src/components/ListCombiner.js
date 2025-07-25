import React, { useState } from 'react';

const ListCombiner = () => {
  const [list1, setList1] = useState('[{"positions": [1, 4], "values": ["A", "B"]}, {"positions": [6, 8], "values": ["C"]}]');
  const [list2, setList2] = useState('[{"positions": [2, 5], "values": ["D"]}, {"positions": [10, 12], "values": ["E", "F"]}]');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const parsedList1 = JSON.parse(list1);
      const parsedList2 = JSON.parse(list2);

      const response = await fetch('http://localhost:3001/api/v1/combine-lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          list1: parsedList1,
          list2: parsedList2
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        alert('Error: Invalid JSON format in lists');
      } else {
        alert('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setList1('[{"positions": [1, 4], "values": ["A", "B"]}, {"positions": [6, 8], "values": ["C"]}]');
    setList2('[{"positions": [2, 5], "values": ["D"]}, {"positions": [10, 12], "values": ["E", "F"]}]');
    setResult('');
  };

  const isValidJSON = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const loadTemplate = (type) => {
    switch (type) {
      case 'simple':
        setList1('[{"positions": [1, 3], "values": ["A"]}, {"positions": [5, 7], "values": ["B"]}]');
        setList2('[{"positions": [2, 4], "values": ["C"]}, {"positions": [8, 10], "values": ["D"]}]');
        break;
      case 'complex':
        setList1('[{"positions": [1, 8], "values": ["Document", "Title"]}, {"positions": [15, 25], "values": ["Content", "Body"]}]');
        setList2('[{"positions": [5, 12], "values": ["Header"]}, {"positions": [20, 30], "values": ["Footer", "End"]}]');
        break;
      case 'overlap':
        setList1('[{"positions": [1, 10], "values": ["Full", "Range"]}, {"positions": [20, 25], "values": ["Second"]}]');
        setList2('[{"positions": [5, 15], "values": ["Overlap"]}, {"positions": [22, 27], "values": ["Merge"]}]');
        break;
      default:
        break;
    }
  };

  const loadExample = () => {
    loadTemplate('simple');
  };

  return (
    <div className="component-container">
      <h2>🔗 Intelligent List Combiner</h2>
      <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
        Merge position-based lists intelligently using advanced overlap detection algorithms
      </p>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="list1">List 1 - Position Based Elements:</label>
          <div className="json-input-container">
            <textarea
              id="list1"
              value={list1}
              onChange={(e) => setList1(e.target.value)}
              required
              placeholder='[{"positions": [1, 4], "values": ["A", "B"]}]'
              rows="6"
              className="enhanced-textarea json-textarea"
            />
            <div className="json-indicator">
              <span className={`json-status ${isValidJSON(list1) ? 'valid' : 'invalid'}`}>
                {isValidJSON(list1) ? '✓ Valid JSON' : '⚠ Invalid JSON'}
              </span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="list2">List 2 - Position Based Elements:</label>
          <div className="json-input-container">
            <textarea
              id="list2"
              value={list2}
              onChange={(e) => setList2(e.target.value)}
              required
              placeholder='[{"positions": [2, 5], "values": ["D"]}]'
              rows="6"
              className="enhanced-textarea json-textarea"
            />
            <div className="json-indicator">
              <span className={`json-status ${isValidJSON(list2) ? 'valid' : 'invalid'}`}>
                {isValidJSON(list2) ? '✓ Valid JSON' : '⚠ Invalid JSON'}
              </span>
            </div>
          </div>
        </div>

        <div className="quick-templates">
          <label>Quick Templates:</label>
          <div className="template-buttons">
            <button
              type="button"
              onClick={() => loadTemplate('simple')}
              className="template-btn"
            >
              Simple Example
            </button>
            <button
              type="button"
              onClick={() => loadTemplate('complex')}
              className="template-btn"
            >
              Complex Example
            </button>
            <button
              type="button"
              onClick={() => loadTemplate('overlap')}
              className="template-btn"
            >
              Overlap Example
            </button>
          </div>
        </div>

        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? 'Combining...' : 'Combine Lists'}
          </button>
          <button type="button" onClick={loadExample} className="secondary-button">
            Load Example
          </button>
          <button type="button" onClick={clearForm} className="secondary-button">
            Clear
          </button>
        </div>
      </form>

      {result && (
        <div className="result-section">
          <h3>Result:</h3>
          <div className="result-box">
            <div className="list-display">
              <h4>Original List 1:</h4>
              <pre>{JSON.stringify(result.list1, null, 2)}</pre>
            </div>
            <div className="list-display">
              <h4>Original List 2:</h4>
              <pre>{JSON.stringify(result.list2, null, 2)}</pre>
            </div>
            <div className="list-display">
              <h4>Combined Result:</h4>
              <pre>{JSON.stringify(result.combined_list, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

      <div className="info-section">
        <h3>Format Information:</h3>
        <p>Each list should be an array of objects with:</p>
        <ul>
          <li><strong>positions:</strong> Array with [left_position, right_position]</li>
          <li><strong>values:</strong> Array of values for that position range</li>
        </ul>
        <p><strong>Example:</strong> <code>{"{"}"positions": [1, 5], "values": ["Hello", "World"]{"}"}</code></p>
      </div>
    </div>
  );
};

export default ListCombiner;
