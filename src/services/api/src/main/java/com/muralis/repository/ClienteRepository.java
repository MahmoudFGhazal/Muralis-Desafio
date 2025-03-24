package com.muralis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.muralis.modal.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    Boolean existsByCpf(String cpf);
}
