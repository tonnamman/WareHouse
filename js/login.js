import { supabase } from './supabaseClient.js';

document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .maybeSingle()

  if (error) {
    console.error(error);
    alert('Login failed');
  } else if (!data) {
    alert('Login failed: username/password incorrect');
  } else {
    localStorage.setItem('user_id', data.id);
    window.location.href = 'dashboard.html';
  }

});
