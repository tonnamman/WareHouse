import { supabase } from './supabaseClient.js';

// โหลดข้อมูลสินค้า
async function loadProducts() {
  const { data: products, error } = await supabase.from('products').select('*').order('id', { ascending: true });
  if (error) {
    console.error(error);
    return;
  }
  const tbody = document.querySelector('#productsTable tbody');
  tbody.innerHTML = '';
  products.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.description || ''}</td>
      <td>
        <button class="btn btn-warning" onclick="editProduct(${p.id}, '${p.name}', '${p.description || ''}')">แก้ไข</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// เปิด modal
window.openModal = id => document.getElementById(id).style.display = 'flex';
window.closeModal = id => document.getElementById(id).style.display = 'none';

// บันทึกสินค้าใหม่หรือแก้ไข
window.saveProduct = async () => {
  const id = document.getElementById('productId').value;
  const name = document.getElementById('productName').value;
  const description = document.getElementById('productDesc').value;

  if (!name) {
    alert('กรุณากรอกชื่อสินค้า');
    return;
  }

  let error;
  if (id) {
    // update
    ({ error } = await supabase.from('products').update({ name, description }).eq('id', id));
  } else {
    // insert
    ({ error } = await supabase.from('products').insert([{ name, description }]));
  }

  if (error) {
    console.error(error);
    alert('บันทึกไม่สำเร็จ');
  } else {
    closeModal('productModal');
    loadProducts();
    clearForm();
  }
};

// แก้ไขสินค้า
window.editProduct = (id, name, desc) => {
  document.getElementById('productId').value = id;
  document.getElementById('productName').value = name;
  document.getElementById('productDesc').value = desc;
  openModal('productModal');
};



// ล้าง form
function clearForm() {
  document.getElementById('productId').value = '';
  document.getElementById('productName').value = '';
  document.getElementById('productDesc').value = '';
}

window.addEventListener('DOMContentLoaded', loadProducts);
