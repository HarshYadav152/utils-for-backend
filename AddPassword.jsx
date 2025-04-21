import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

const AddPassword = () => {
  const [formData, setFormData] = useState({
    username: '',
    website: '',
    password: '',
    keyword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEncrypt = () => {
    const { username, password, keyword } = formData;

    if (!keyword.trim()) {
      alert('Keyword is required for encryption.');
      return;
    }

    const encryptedUsername = CryptoJS.AES.encrypt(username, keyword).toString();
    const encryptedPassword = CryptoJS.AES.encrypt(password, keyword).toString();
    const encryptedKeyword = CryptoJS.AES.encrypt(keyword, keyword).toString();

    setFormData((prev) => ({
      ...prev,
      username: encryptedUsername,
      password: encryptedPassword,
      keyword: encryptedKeyword,
    }));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h2>🔒 Encrypt Form Fields</h2>
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
      </label>
      <label>
        Website:
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
      </label>
      <label>
        Password:
        <input
          type="text"
          name="password"
          value={formData.password}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
      </label>
      <label>
        Keyword (used to encrypt):
        <input
          type="text"
          name="keyword"
          value={formData.keyword}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: '20px', padding: '8px' }}
        />
      </label>

      <button onClick={handleEncrypt} style={{ padding: '10px 20px' }}>
        Encrypt
      </button>
    </div>
  );
};

export default AddPassword;
