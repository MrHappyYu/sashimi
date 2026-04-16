package com.sashimi.module.cart.service;

import com.sashimi.common.BusinessException;
import com.sashimi.module.cart.entity.SmCart;
import com.sashimi.module.dish.entity.SmDish;
import com.sashimi.module.dish.service.DishMapper;
import com.sashimi.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 购物车服务 / Cart service
 */
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartMapper cartMapper;
    private final DishMapper dishMapper;

    public List<SmCart> list() {
        return cartMapper.listByUser(SecurityUtil.getCurrentUserId());
    }

    public void add(Long dishId, Integer quantity) {
        Long userId = SecurityUtil.getCurrentUserId();
        SmDish dish = dishMapper.findById(dishId);
        if (dish == null || dish.getStatus() != 1) {
            throw new BusinessException("菜品不存在或已下架");
        }
        if (quantity <= 0) throw new BusinessException("数量必须大于0");

        SmCart existing = cartMapper.findByUserAndDish(userId, dishId);
        if (existing != null) {
            cartMapper.updateQuantity(existing.getId(), existing.getQuantity() + quantity);
        } else {
            SmCart cart = new SmCart();
            cart.setUserId(userId);
            cart.setDishId(dishId);
            cart.setDishName(dish.getName());
            cart.setDishImage(dish.getImage());
            cart.setPrice(dish.getPrice());
            cart.setQuantity(quantity);
            cartMapper.insert(cart);
        }
    }

    public void update(Long cartId, Integer quantity) {
        Long userId = SecurityUtil.getCurrentUserId();
        if (quantity <= 0) {
            cartMapper.deleteByIdAndUser(cartId, userId);
        } else {
            cartMapper.updateQuantity(cartId, quantity);
        }
    }

    public void remove(Long cartId) {
        cartMapper.deleteByIdAndUser(cartId, SecurityUtil.getCurrentUserId());
    }

    public void clear() {
        cartMapper.clearByUser(SecurityUtil.getCurrentUserId());
    }
}
