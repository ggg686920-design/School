/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Transport View — Section 24: أسطول النقل المدرسي والخطوط
 */

import React, { useState, useEffect } from 'react';
import { Bus, User, Shield, AlertTriangle, Phone, MapPin, Clock, Calendar } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { TransportRoute, Driver, Vehicle } from '../../types';

export const TransportView: React.FC = () => {
  const { db, settings } = useSchool();
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeTab, setActiveTab] = useState<'routes' | 'drivers' | 'vehicles'>('routes');

  useEffect(() => {
    Promise.all([db.getRoutes(), db.getDrivers(), db.getVehicles()]).then(
      ([rList, dList, vList]) => {
        setRoutes(rList);
        setDrivers(dList);
        setVehicles(vList);
      }
    );
  }, [db]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
            منظومة النقل المدرسي والحافلات
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            إدارة خطوط النقل، السائقين، والمركبات وسلامة الطلاب في {settings.name}
          </p>
        </div>

        <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('routes')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'routes' ? 'bg-[#2563EB] text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            خطوط النقل ({routes.length})
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'drivers' ? 'bg-[#2563EB] text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            السائقون ({drivers.length})
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'vehicles' ? 'bg-[#2563EB] text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            المركبات ({vehicles.length})
          </button>
        </div>
      </div>

      {/* Routes List */}
      {activeTab === 'routes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routes.map(r => (
            <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono text-[#2563EB] font-bold block">{r.routeNumber}</span>
                  <h3 className="font-bold text-slate-900 text-sm">{r.name}</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-50 text-[#2563EB] border border-blue-100">
                  {r.studentsCount} / {r.capacity} طالب
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>المناطق: {r.neighborhoods.join(' · ')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>الانطلاق: {r.morningTime} · العودة: {r.afternoonTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>السائق: {r.driverName} ({r.driverPhone})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bus className="w-3.5 h-3.5 text-slate-400" />
                  <span>المركبة: {r.vehiclePlate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drivers List */}
      {activeTab === 'drivers' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-4">اسم السائق</th>
                <th className="py-3 px-4">الهاتف</th>
                <th className="py-3 px-4">رقم وإجازة السوق</th>
                <th className="py-3 px-4">تاريخ انتهاء الإجازة</th>
                <th className="py-3 px-4">الراتب الشهري</th>
                <th className="py-3 px-4">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {drivers.map(d => {
                const isExpiringSoon = d.licenseExpiryDate.startsWith('2026-10');
                return (
                  <tr key={d.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">{d.fullName}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{d.phone}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{d.licenseNumber} ({d.licenseType})</td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <span className={isExpiringSoon ? 'text-[#DC2626] bg-rose-50 px-2 py-0.5 rounded' : 'text-slate-800'}>
                        {d.licenseExpiryDate}
                        {isExpiringSoon && ' (تجديد مطلوب قريباً)'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#16A34A]">{d.salary.toLocaleString()} د.ع</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                        مستمر
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Vehicles List */}
      {activeTab === 'vehicles' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vehicles.map(v => (
            <div key={v.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">{v.type}</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                  {v.status}
                </span>
              </div>
              <p className="text-slate-500">{v.model} ({v.makeYear}) · اللون: {v.color}</p>
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">رقم اللوحة:</span>
                  <span className="font-bold text-slate-900 font-mono">{v.plateNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">سعة الركاب:</span>
                  <span className="font-semibold text-slate-800 font-mono">{v.seatsCapacity} مقعد</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">صلاحية الفحص الدوري:</span>
                  <span className="font-mono text-slate-700">{v.inspectionExpiryDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
