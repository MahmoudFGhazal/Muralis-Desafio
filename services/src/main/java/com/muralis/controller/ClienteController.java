package com.muralis.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.muralis.modal.Cliente;
import com.muralis.service.ClienteService;
import com.muralis.service.ContatoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("cliente")
@CrossOrigin
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;
    private final ContatoService contatoService;
    
    @PostMapping
    public ResponseEntity<Cliente> addClient(@RequestBody Cliente cliente){
        return ResponseEntity.ok(clienteService.save(cliente));
    }

    @GetMapping("/check-cpf/{cpf}")
    public ResponseEntity<Boolean> checkCpfExists(@PathVariable String cpf){
        Boolean exists = clienteService.existsByCpf(cpf);
        return ResponseEntity.ok(exists);
    }

    @GetMapping
    public ResponseEntity<List<Cliente>> listClients(){
        return ResponseEntity.ok(clienteService.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> getById(@PathVariable Integer id){
        Optional<Cliente> cliente = clienteService.getById(id);
        return cliente.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/{id}/cpf")
    public ResponseEntity<String> getCpf(@PathVariable Integer id) {
        Optional<Cliente> cliente = clienteService.getById(id);
        if (cliente.isPresent()) {
            return ResponseEntity.ok(cliente.get().getCpf());  // Retorna o CPF do cliente
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();  // Retorna NOT_FOUND caso o cliente não seja encontrado
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> upadateClient(@PathVariable Integer id, @RequestBody Cliente cliente){
        return clienteService.update(id, cliente)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Integer id){
        contatoService.deleteByClienteId(id);
        return clienteService.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
