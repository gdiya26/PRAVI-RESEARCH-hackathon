import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, useMap } from 'react-leaflet';
import ConditionBadge from '../common/ConditionBadge';
import HealthScore from '../common/HealthScore';
import { CONDITION_COLORS } from '../../utils/formatters';
import { AHMEDABAD_CENTER, STAGE_LABELS } from '../../utils/constants';
import { ExternalLink, MapPin } from 'lucide-react';

function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 12);
    }
  }, [center, zoom, map]);
  return null;
}

export default function AssetMap({
  assets = [],
  height = '560px',
  center = AHMEDABAD_CENTER,
  zoom = 12,
  selectedAssetId = null
}) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: '100%',
        height: height,
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#E5E3DF'
      }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <MapRecenter center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {assets.map((asset) => {
          const conditionColor = CONDITION_COLORS[asset.condition] || '#1B4079';
          const hasPath =
            asset.location?.path &&
            Array.isArray(asset.location.path) &&
            asset.location.path.length >= 2;

          const lat = asset.location?.lat;
          const lng = asset.location?.lng;
          const hasPoint = lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng);

          const isSelected = selectedAssetId && (asset.assetId === selectedAssetId || asset._id === selectedAssetId);

          return (
            <React.Fragment key={asset._id || asset.assetId}>
              {/* Roads with polylines */}
              {hasPath && (
                <Polyline
                  positions={asset.location.path}
                  pathOptions={{
                    color: conditionColor,
                    weight: isSelected ? 8 : 6,
                    opacity: isSelected ? 1 : 0.85,
                    dashArray: asset.lifecycleStage === 'BUILD' ? '6, 8' : undefined
                  }}
                >
                  <Popup>
                    <div style={{ minWidth: '220px', fontFamily: 'var(--font-family)', padding: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--navy-700)', fontSize: '13px' }}>
                          {asset.assetId}
                        </span>
                        <ConditionBadge condition={asset.condition} size="sm" />
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--navy-900)', fontSize: '13px', marginBottom: '4px' }}>
                        {asset.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        {asset.type} &bull; {STAGE_LABELS[asset.lifecycleStage] || asset.lifecycleStage}
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <HealthScore score={asset.healthScore} compact />
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ width: '100%' }}
                        onClick={() => navigate(`/assets/${asset.assetId}`)}
                      >
                        <ExternalLink size={12} />
                        Open Digital Asset Passport
                      </button>
                    </div>
                  </Popup>
                </Polyline>
              )}

              {/* Structures, Traffic, or fallback point */}
              {hasPoint && (
                <CircleMarker
                  center={[lat, lng]}
                  radius={isSelected ? 10 : (asset.category === 'STRUCTURE' ? 8 : 7)}
                  pathOptions={{
                    fillColor: conditionColor,
                    color: isSelected ? 'var(--accent-gold)' : '#FFFFFF',
                    weight: isSelected ? 3 : 2,
                    fillOpacity: 0.95
                  }}
                >
                  <Popup>
                    <div style={{ minWidth: '220px', fontFamily: 'var(--font-family)', padding: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--navy-700)', fontSize: '13px' }}>
                          {asset.assetId}
                        </span>
                        <ConditionBadge condition={asset.condition} size="sm" />
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--navy-900)', fontSize: '13px', marginBottom: '4px' }}>
                        {asset.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        {asset.category} - {asset.type} &bull; {STAGE_LABELS[asset.lifecycleStage] || asset.lifecycleStage}
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <HealthScore score={asset.healthScore} compact />
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ width: '100%' }}
                        onClick={() => navigate(`/assets/${asset.assetId}`)}
                      >
                        <ExternalLink size={12} />
                        Open Digital Asset Passport
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Map Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '8px 12px',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          fontSize: '11px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          zIndex: 1000
        }}
      >
        <div style={{ fontWeight: 700, color: 'var(--navy-900)', marginBottom: '4px' }}>
          Condition Legend
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: CONDITION_COLORS.GOOD, borderRadius: '50%' }} />
            <span>Good</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: CONDITION_COLORS.FAIR, borderRadius: '50%' }} />
            <span>Fair</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: CONDITION_COLORS.POOR, borderRadius: '50%' }} />
            <span>Poor</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: CONDITION_COLORS.CRITICAL, borderRadius: '50%' }} />
            <span>Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
}
