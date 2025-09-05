import { supabase } from './supabaseClient.js';

// โหลดข้อมูลรายการทั้งหมด
async function loadRecords() {
  /* สมมติในตาราง inventory เก็บข้อมูลการเคลื่อนไหว
     มีฟิลด์: id, product_id, quantity, type, created_at, user_id
     และ products กับ users มี FK
  */
  const { data: records, error } = await supabase.from('inventory').select(`
    id,
    quantity,
    type,
    timestmp,
    products (name),
    users (username)
  `).order('timestmp', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const tbody = document.querySelector('#recordsTable tbody');
  tbody.innerHTML = '';

  records.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(r.timestmp).toLocaleString()}</td>
      <td>${r.products?.name || ''}</td>
      <td>${r.type === 'รับเข้า' ? '+' : '-'}${r.quantity}</td>
      <td style="color:${r.type === 'รับเข้า' ? 'green':'red'};">${r.type}</td>
      <td>${r.users?.username || ''}</td>
    `;
    tbody.appendChild(tr);
  });
}

// โหลดเมื่อหน้าเพจเปิด
window.addEventListener('DOMContentLoaded', loadRecords);

// ถ้ามี logout() อยู่ใน global อยู่แล้ว หน้าอื่นใช้ร่วมกันได้
