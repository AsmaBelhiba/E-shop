import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(savedCart);
        updateCount(savedCart);
    }, []);

    const updateCount = (items) => {
        const count = items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(count);
    };

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        let newCart;
        if (existing) {
            newCart = cart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            newCart = [...cart, { ...product, quantity: 1 }];
        }
        setCart(newCart);
        updateCount(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const removeFromCart = (productId) => {
        const newCart = cart.filter(item => item.id !== productId);
        setCart(newCart);
        updateCount(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return removeFromCart(productId);
        const newCart = cart.map(item =>
            item.id === productId ? { ...item, quantity } : item
        );
        setCart(newCart);
        updateCount(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const clearCart = () => {
        setCart([]);
        setCartCount(0);
        localStorage.removeItem('cart');
    };

    const getCartTotal = () => {
        return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);
    };

    return (
        <CartContext.Provider value={{
            cart,
            cartCount,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
