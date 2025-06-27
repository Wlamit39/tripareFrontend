// pages/index.tsx
'use client';
import { useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';

interface Hotel {
  hotelId: string;
  name: string;
  price: number;
  city: string;
}

interface SearchResponse {
  result: Hotel[];
  diagnostics: {
    supplierA: string;
    supplierB: string;
  };
}

export default function Home() {
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [diagnostics, setDiagnostics] = useState<{ supplierA: string; supplierB: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchHotels = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post<SearchResponse>('http://localhost:3100/api/search-hotels', {
        city,
        checkIn,
        checkOut,
      });
      setHotels(response.data.result);
      setDiagnostics(response.data.diagnostics);
    } catch (err) {
      setError('Failed to fetch hotels');
      setHotels([]);
      setDiagnostics(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: 20,
      fontFamily: 'sans-serif',
      maxWidth: 600,
      margin: '0 auto'
    }}>
      <h1 style={{ textAlign: 'center' }}>🏨 Hotel Rate Comparator</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={e => setCity(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 4,
            border: '1px solid #ccc'
          }}
        />
        <input
          type="date"
          value={checkIn}
          onChange={e => setCheckIn(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 4,
            border: '1px solid #ccc'
          }}
        />
        <input
          type="date"
          value={checkOut}
          onChange={e => setCheckOut(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 4,
            border: '1px solid #ccc'
          }}
        />
        <button
          onClick={searchHotels}
          style={{
            padding: 12,
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Search
        </button>
      </div>

      {loading ? <Spinner /> : 'Search'}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {hotels.length > 0 && (
        <div>
          <h2>✅ Cheapest Hotels</h2>
          <ul style={{ paddingLeft: 20 }}>
            {hotels.map(hotel => (
              <li key={hotel.hotelId} style={{ marginBottom: 10 }}>
                <strong>{hotel.name}</strong> — ₹{hotel.price} ({hotel.city})
              </li>
            ))}
          </ul>
        </div>
      )}

      {diagnostics && (
      <div
        style={{
          marginTop: '1rem',
          background: '#e0f2ff', // Light blue background
          padding: '12px 16px',
          borderRadius: '6px',
          border: '1px solid #90cdf4', // matching blue border
          color: '#1a202c', // dark text
        }}
      >
        <h4 style={{ marginBottom: 8, color: '#2b6cb0' }}>📊 Diagnostics</h4>
        <p><strong>Supplier A:</strong> {diagnostics.supplierA}</p>
        <p><strong>Supplier B:</strong> {diagnostics.supplierB}</p>
      </div>
    )}

    </div>
  );
}
