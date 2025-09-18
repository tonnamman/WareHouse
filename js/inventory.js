import { supabase } from './supabaseClient.js';

// เปิด modal
window.openModal = async id => {
  await populateProducts(); // ดึงชื่อสินค้าลง dropdown ทุกครั้ง
  document.getElementById(id).style.display = 'flex';
};

// ปิด modal
window.closeModal = id => document.getElementById(id).style.display = 'none';

// ดึงสินค้าใส่ dropdown
async function populateProducts() {
  const { data: products, error } = await supabase.from('products').select('*');
  if (error) {
    console.error(error);
    return;
  }

  const selects = [
    document.getElementById('inProductSelect'),
    document.getElementById('outProductSelect')
  ];

  selects.forEach(select => {
    select.innerHTML = '<option value="">-- เลือกสินค้า --</option>';

    products.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;           // ✅ id ของ product
      opt.textContent = p.name;   // ชื่อสินค้า
      select.appendChild(opt);
    });
  });
}


// โหลดข้อมูล inventory
window.loadInventory = async () => {
  // สมมติในตาราง inventory มี field: inventory_id, product_id, quantity, type
  const { data: inventory, error } = await supabase.from('inventory').select(`
    id,
    quantity,
    type,
    products (name),
    timestmp,
    users(username)
  `).order('timestmp', { ascending: false });
  if (error) { console.error(error); return; }

  const tbody = document.getElementById('inventoryTable');
  tbody.innerHTML = '';
  inventory.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.id}</td>
      <td>${row.products?.name || ''}</td>
      <td>${row.quantity}</td>
      <td style="color:${row.type === 'รับเข้า' ? 'green':'red'};">${row.type}</td>
    `;
    tbody.appendChild(tr);
  });
};

// บันทึก รับสินค้าเข้า
window.saveIn = async () => {
  const product_id = document.getElementById('inProductSelect').value;
  const qty = parseInt(document.getElementById('inQuantity').value);
   const user_id = localStorage.getItem('user_id');

  if (!product_id) {
    alert('กรุณาเลือกสินค้า');
    return;
  }
  if (isNaN(qty) || qty <= 0) {
    alert('กรุณากรอกจำนวนมากกว่า 0');
    return;
  }

  const { error } = await supabase.from('inventory').insert([
    { product_id: parseInt(product_id), quantity: qty, type: 'รับเข้า',user_id: parseInt(user_id) }
  ]);

  if (error) {
    console.error(error);
    alert('บันทึกไม่สำเร็จ');
  } else {
    closeModal('inModal');  
    loadInventory();
  }
};

// บันทึก จ่ายสินค้าออก
window.saveOut = async () => {
  const product_id = document.getElementById('outProductSelect').value;
  const qty = parseInt(document.getElementById('outQuantity').value);
  const user_id = localStorage.getItem('user_id');

  const { error } = await supabase.from('inventory').insert([
    { product_id: product_id, quantity: qty, type: 'จ่ายออก', user_id: parseInt(user_id) }
  ]);
  if (error) {
    console.error(error);
    alert('บันทึกไม่สำเร็จ');
  } else {
    closeModal('outModal');
    loadInventory();
  }
};

// โหลดข้อมูลเมื่อหน้าเพจเปิด
window.addEventListener('DOMContentLoaded', loadInventory);
