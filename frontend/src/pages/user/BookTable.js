import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import styles from './BookTable.module.css';

const TIME_SLOTS = [
  '12:00 PM – Lunch','12:30 PM – Lunch','1:00 PM – Lunch','1:30 PM – Lunch',
  '7:00 PM – Dinner','7:30 PM – Dinner','8:00 PM – Dinner','8:30 PM – Dinner','9:00 PM – Dinner',
];

const BookTable = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    timeSlot: '', guests: '', occasion: '', requests: '',
  });
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  const checkAvailability = async () => {
    if (!form.date || !form.timeSlot) return;
    setChecking(true);
    try {
      const { data } = await API.get(`/bookings/availability?date=${form.date}&timeSlot=${encodeURIComponent(form.timeSlot)}`);
      setTables(data.tables);
    } catch { toast.error('Could not load tables'); }
    finally { setChecking(false); }
  };

  const goStep2 = () => {
    if (!form.date || !form.timeSlot || !form.guests) { toast.error('Please fill all required fields'); return; }
    checkAvailability();
    setStep(2);
  };

  const goStep3 = () => {
    if (!selectedTable) { toast.error('Please select a table'); return; }
    setStep(3);
  };

  const confirm = async () => {
    setLoading(true);
    try {
      await API.post('/bookings', { tableId: selectedTable._id, ...form, guests: +form.guests });
      toast.success('🎉 Table reserved successfully!');
      navigate('/dashboard/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally { setLoading(false); }
  };

  const section = selectedTable?.section || '';

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Reserve a Table</h1>

      {/* Step indicator */}
      <div className={styles.steps}>
        {['Details','Choose Table','Confirm'].map((s, i) => (
          <React.Fragment key={s}>
            <div className={styles.step}>
              <div className={`${styles.stepNum} ${step > i+1 ? styles.done : step === i+1 ? styles.active : ''}`}>
                {step > i+1 ? '✓' : i+1}
              </div>
              <span className={`${styles.stepLabel} ${step === i+1 ? styles.activeLabel : ''}`}>{s}</span>
            </div>
            {i < 2 && <div className={`${styles.stepLine} ${step > i+1 ? styles.lineDone : ''}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className={styles.card}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>📅 Date *</label>
              <input type="date" value={form.date} min={new Date().toISOString().split('T')[0]}
                onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label>🕐 Time Slot *</label>
              <select value={form.timeSlot} onChange={e => setForm({ ...form, timeSlot: e.target.value })}>
                <option value="">Select time</option>
                {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label>👥 Number of Guests *</label>
              <select value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })}>
                <option value="">Select guests</option>
                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n===1?'guest':'guests'}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label>🎉 Occasion</label>
              <select value={form.occasion} onChange={e => setForm({ ...form, occasion: e.target.value })}>
                <option value="">Regular Dining</option>
                {['Birthday 🎂','Anniversary 💑','Business Lunch','Family Get-together','Engagement 💍','Festival Celebration'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.field} style={{ marginTop: '1rem' }}>
            <label>📝 Special Requests</label>
            <textarea rows={3} value={form.requests}
              placeholder="Dietary restrictions, seating preferences, decorations..."
              onChange={e => setForm({ ...form, requests: e.target.value })} />
          </div>
          <button className={styles.btn} onClick={goStep2}>Check Availability →</button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className={styles.card}>
          <p className={styles.subtitle}>Select an available table for {form.date} at {form.timeSlot}</p>
          {checking ? <p className={styles.loading}>Loading tables...</p> : (
            <>
              <div className={styles.tablesGrid}>
                {tables.map(t => (
                  <div key={t._id}
                    className={`${styles.tableCard} ${t.isBooked ? styles.booked : styles.available} ${selectedTable?._id === t._id ? styles.selected : ''}`}
                    onClick={() => !t.isBooked && setSelectedTable(t)}
                  >
                    <span className={styles.tableIcon}>
                      {t.section==='Window'?'🪟':t.section==='VIP'?'👑':t.section==='Garden'?'🌿':t.section==='Banquet'?'🎉':t.section==='Family'?'👨‍👩‍👧‍👦':'🍽'}
                    </span>
                    <div className={styles.tableNum}>Table {t.tableNumber}</div>
                    <div className={styles.tableSub}>{t.seats} seats · {t.section}</div>
                    <span className={`${styles.tableStatus} ${t.isBooked ? styles.statusBooked : selectedTable?._id === t._id ? styles.statusSelected : styles.statusFree}`}>
                      {t.isBooked ? 'Booked' : selectedTable?._id === t._id ? '✓ Selected' : 'Available'}
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles.btnRow}>
                <button className={styles.btnOutline} onClick={() => setStep(1)}>← Back</button>
                <button className={styles.btn} onClick={goStep3} disabled={!selectedTable}>Review Booking →</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className={styles.card}>
          <div className={styles.summary}>
            <h3>✨ Booking Summary</h3>
            {[
              ['📅 Date', form.date],
              ['🕐 Time', form.timeSlot],
              ['👥 Guests', `${form.guests} guests`],
              ['🪑 Table', `Table ${selectedTable?.tableNumber} · ${selectedTable?.section}`],
              ['💺 Seats', `${selectedTable?.seats} seats`],
              form.occasion ? ['🎉 Occasion', form.occasion] : null,
              form.requests ? ['📝 Note', form.requests] : null,
            ].filter(Boolean).map(([k,v]) => (
              <div key={k} className={styles.summaryRow}><span>{k}</span><span>{v}</span></div>
            ))}
          </div>
          <div className={styles.btnRow}>
            <button className={styles.btnOutline} onClick={() => setStep(2)}>← Back</button>
            <button className={styles.btn} onClick={confirm} disabled={loading}>
              {loading ? 'Confirming...' : '✓ Confirm Reservation'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookTable;
