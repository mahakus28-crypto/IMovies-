import React from 'react';

const SeatGrid = ({
  rows = 6,
  cols = 10,
  bookedSeats = [],
  selectedSeats = [],
  onSeatToggle,
  maxSeats = 8
}) => {
  // Convert row index to letter: 0 -> A, 1 -> B, etc.
  const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').slice(0, rows);

  const isSeatBooked = (seatId) => bookedSeats.includes(seatId);
  const isSeatSelected = (seatId) => selectedSeats.includes(seatId);

  const handleSeatClick = (seatId) => {
    if (isSeatBooked(seatId)) return;
    onSeatToggle(seatId);
  };

  return (
    <div className="seat-selection-wrapper py-3">
      {/* Screen visual */}
      <div className="cinema-screen-container">
        <div className="cinema-screen-curved"></div>
        <div className="cinema-screen-label">All Eyes This Way • Cinema Screen</div>
      </div>

      {/* Seat Rows Grid */}
      <div className="d-flex flex-column align-items-center my-4 overflow-auto px-2">
        {rowLetters.map((rowLetter, rowIndex) => {
          const isVipRow = rowLetter === 'A' || rowLetter === 'B';

          return (
            <div key={rowLetter} className="seat-row">
              <span className="seat-row-label">
                {rowLetter}
                {isVipRow && <span className="d-block text-warning" style={{ fontSize: '0.6rem' }}>VIP</span>}
              </span>

              {Array.from({ length: cols }, (_, colIndex) => {
                const seatNum = colIndex + 1;
                const seatId = `${rowLetter}${seatNum}`;
                const booked = isSeatBooked(seatId);
                const selected = isSeatSelected(seatId);

                let seatClass = 'seat-box';
                if (booked) {
                  seatClass += ' seat-booked';
                } else if (selected) {
                  seatClass += ' seat-selected';
                } else if (isVipRow) {
                  seatClass += ' seat-vip';
                } else {
                  seatClass += ' seat-available';
                }

                return (
                  <div
                    key={seatId}
                    className={seatClass}
                    onClick={() => handleSeatClick(seatId)}
                    title={booked ? `Seat ${seatId} is already booked` : `Seat ${seatId} (${isVipRow ? 'VIP' : 'Standard'})`}
                  >
                    {seatNum}
                  </div>
                );
              })}

              <span className="seat-row-label ms-2 text-start">
                {rowLetter}
              </span>
            </div>
          );
        })}
      </div>

      {/* Seat Status Legend */}
      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-swatch" style={{ backgroundColor: 'var(--im-seat-available)', border: '1px solid #3b4256' }}></div>
          <span>Available (Standard)</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch" style={{ backgroundColor: '#2e2646', border: '1px solid #7e22ce' }}></div>
          <span>VIP Recliner</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch" style={{ backgroundColor: 'var(--im-red)', border: '1px solid #ff4d58' }}></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch" style={{ backgroundColor: '#242731', border: '1px solid #323746', opacity: 0.5 }}></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;
