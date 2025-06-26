// pages/index.tsx
'use client';
import { useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';

interface SearchResult {
  result: {
    hotelId: string;
    name: string;
    price: number;
  };
  diagnostics: {
    supplierA: string;
    supplierB: string;
  };
}

export default function HotelSearchPage() {
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await axios.post('http://localhost:3100/api/search-hotels', {
        city,
        checkIn,
        checkOut,
      });

      if (!res.data || !res.data.result) {
        setError('No hotels found.');
      } else {
        setResult(res.data);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow text-blue-800">
      <h1>Hotel Rate Comparator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>City:</label><br />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Check-in Date:</label><br />
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Check-out Date:</label><br />
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          
          {loading ? <Spinner /> : 'Search'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Hotel Found:</h3>
          <p><strong>{result.result.name}</strong></p>
          <p>Price: ₹{result.result.price}</p>
          <p>
            Supplier:{' '}
            {result.diagnostics.supplierA === 'success' &&
            result.diagnostics.supplierB !== 'success'
              ? 'Supplier A'
              : result.diagnostics.supplierB === 'success' &&
                result.diagnostics.supplierA !== 'success'
              ? 'Supplier B'
              : 'Best of A or B'}
          </p>
        </div>
      )}
    </main>
  );
}
