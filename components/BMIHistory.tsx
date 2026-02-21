
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BMIRecord } from '../types';
import { History, User, Scale, Calendar } from 'lucide-react';

interface BMIHistoryProps {
  records: BMIRecord[];
  loading: boolean;
}

// Fix: Use a casted motion component to bypass typing errors where motion props are not recognized
const MotionTr = motion.tr as any;

export const BMIHistory: React.FC<BMIHistoryProps> = ({ records, loading }) => {
  return (
    <div className="w-full mt-12 mb-20">
      <div className="flex items-center gap-3 mb-6 px-4">
        <History className="text-indigo-400 w-6 h-6" />
        <h2 className="text-2xl font-bold text-white">Recent Records</h2>
      </div>

      <div className="overflow-x-auto rounded-2xl dark-glass p-2">
        <table className="w-full text-left text-white border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-400 text-sm uppercase tracking-wider font-semibold">
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">BMI</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {records.length === 0 && !loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-500 italic">
                    No records found. Calculate your BMI to start your history!
                  </td>
                </tr>
              ) : (
                records.map((record, index) => (
                  <MotionTr
                    key={record.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass hover:bg-white/10 transition-colors group cursor-default"
                  >
                    <td className="px-6 py-4 rounded-l-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <div className="font-bold">{record.name}</div>
                          <div className="text-xs text-gray-400">{record.age}y • {record.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-blue-400" />
                        <span className="font-mono text-lg font-bold">{record.bmi.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-tight uppercase ${
                        record.category === 'Underweight' ? 'bg-blue-500/20 text-blue-400' :
                        record.category === 'Normal' ? 'bg-green-500/20 text-green-400' :
                        record.category === 'Overweight' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {record.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 rounded-r-xl">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        {record.created_at ? new Date(record.created_at).toLocaleDateString() : 'Just now'}
                      </div>
                    </td>
                  </MotionTr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};
