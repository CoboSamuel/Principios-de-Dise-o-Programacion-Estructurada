package com.udla.arquitectura.demo.service;

import com.udla.arquitectura.demo.model.Producto;
import com.udla.arquitectura.demo.repository.ProductoRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @Cacheable("productos")
    public List<Producto> listarTodos() {
        return productoRepository.listarTodos();
    }

    @Cacheable(value = "producto", key = "#id")
    public Producto buscarPorId(Long id) {
        return productoRepository.buscarPorId(id);
    }
}